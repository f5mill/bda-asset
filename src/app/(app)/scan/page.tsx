
"use client"
import { useState, useEffect, Suspense, useCallback, useRef } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { RefreshCw, Camera, Scan, QrCode } from "lucide-react"
import jsQR from "jsqr"

import { assets, users } from "@/lib/data"
import type { Asset, User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ClientDate } from "@/components/client-date"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ScanPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [action, setAction] = useState<string>("update_location")
  const [mode, setMode] = useState<"scanner" | "camera">("scanner")
  const [inputValue, setInputValue] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>()
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)

  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null)
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const assetId = searchParams.get('assetId')

  const [isAssignCustodyDialogOpen, setIsAssignCustodyDialogOpen] = useState(false)
  const [assetToAssign, setAssetToAssign] = useState<Asset | null>(null)
  const [selectedCustodianId, setSelectedCustodianId] = useState<string | null>(null)

  const processScan = useCallback((scannedUrl: string) => {
    try {
      if (!scannedUrl) return
      
      const url = new URL(scannedUrl)
      if (url.origin !== window.location.origin || url.pathname !== '/scan') {
        throw new Error("Invalid QR code for this application.")
      }
      const scannedQrId = url.searchParams.get('id')
      if (!scannedQrId) {
        throw new Error("QR code does not contain an ID.")
      }

      const asset = assets.find(a => a.qrCodeId === scannedQrId)
      if (!asset) {
        toast({
          variant: "destructive",
          title: "Unassigned QR Code",
          description: `This QR code (${scannedQrId}) is not linked to any asset.`,
        })
        return
      }

      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
      if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop())
      }

      switch (action) {
        case 'view_asset':
          router.push(`/assets/${asset.id}`)
          break
        case 'update_location':
          router.push(`/scan?assetId=${asset.id}`)
          break
        case 'assign_custody':
            setAssetToAssign(asset)
            setSelectedCustodianId(asset.custodian?.id ?? null)
            setIsAssignCustodyDialogOpen(true)
            break
        default:
          toast({
            title: "Action Not Implemented",
            description: `The action "${action}" is not yet available.`,
          })
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Scan Error',
        description: (e as Error).message || 'Failed to process the scanned code.',
      })
    } finally {
        setInputValue("")
    }
  }, [action, router, toast])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processScan(inputValue)
    }
  }

  const parseUserAgent = useCallback((ua: string) => {
    let browser = 'Unknown'
    let os = 'Unknown'
    let device = 'Desktop'
    if (/windows/i.test(ua)) os = 'Windows'
    else if (/macintosh|mac os x/i.test(ua)) os = 'macOS'
    else if (/android/i.test(ua)) os = 'Android'
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
    else if (/linux/i.test(ua)) os = 'Linux'
    if (/edg/i.test(ua)) browser = 'Edge'
    else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) browser = 'Chrome'
    else if (/firefox/i.test(ua)) browser = 'Firefox'
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari'
    if (/mobi/i.test(ua)) device = 'Mobile'
    return { browser, os, device }
  }, [])

  const updateAssetLocation = useCallback((asset: Asset) => {
    setIsUpdatingLocation(true)
    setUpdateError(null)

    if (!navigator.geolocation) {
      const errorMsg = 'Your browser does not support geolocation.'
      toast({ variant: 'destructive', title: 'Geolocation not supported', description: errorMsg })
      setUpdateError(errorMsg)
      setIsUpdatingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const deviceInfo = parseUserAgent(navigator.userAgent)
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          if (!response.ok) throw new Error('Failed to fetch address.')
          const data = await response.json()
          const newLocation = data.locality && data.principalSubdivision ? `${data.locality}, ${data.principalSubdivision}` : `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
          
          const updatedAsset: Asset = {
            ...asset,
            location: { ...asset.location, lat: latitude, lng: longitude, address: newLocation },
            lastScan: new Date().toISOString(),
            scanDetails: { ...deviceInfo, source: 'QR Code Scan' }
          }
          const assetIndex = assets.findIndex(a => a.id === asset.id)
          if (assetIndex !== -1) assets[assetIndex] = updatedAsset
          setScannedAsset(updatedAsset)
          toast({ title: 'Location Updated', description: `Asset location updated to: ${newLocation}` })
        } catch (apiError: any) {
          const errorMsg = apiError.message || 'Could not fetch address data.'
          toast({ variant: 'destructive', title: 'Geocoding Error', description: errorMsg })
          setUpdateError(errorMsg)
        } finally {
          setIsUpdatingLocation(false)
        }
      },
      (error) => {
        let description = 'Could not get your location.'
        if (error.code === error.PERMISSION_DENIED) description = 'You denied the request for Geolocation.'
        toast({ variant: 'destructive', title: 'Geolocation Error', description })
        setUpdateError(description)
        setIsUpdatingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [toast, parseUserAgent])

  useEffect(() => {
    if (assetId) {
      const assetData = assets.find((a) => a.id === assetId)
      if (assetData) {
        const assetCopy = JSON.parse(JSON.stringify(assetData))
        setScannedAsset(assetCopy)
        if (action === 'update_location') {
          updateAssetLocation(assetCopy)
        }
      } else {
        setScannedAsset(null)
        toast({ variant: "destructive", title: "Asset not found", description: `No asset with ID ${assetId} exists.` })
      }
    }
  }, [assetId, toast, updateAssetLocation, action])

  useEffect(() => {
    if (mode === 'camera' && !assetId) {
      const video = videoRef.current
      const canvas = canvasRef.current

      const tick = () => {
        if (video?.readyState === video.HAVE_ENOUGH_DATA && canvas) {
          canvas.height = video.videoHeight
          canvas.width = video.videoWidth
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" })
            if (code) {
              processScan(code.data)
              return
            }
          }
        }
        if (video?.srcObject) animationFrameId.current = requestAnimationFrame(tick)
      }

      const startCamera = async () => {
        try {
          if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera not supported.')
          let stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).catch(() => navigator.mediaDevices.getUserMedia({ video: true }))
          setHasCameraPermission(true)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            animationFrameId.current = requestAnimationFrame(tick)
          }
        } catch (error) {
          console.error('Error accessing camera:', error)
          setHasCameraPermission(false)
          toast({ variant: 'destructive', title: 'Camera Error', description: 'Please enable camera permissions in your browser settings.' })
        }
      }
      startCamera()

      return () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
        if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop())
        }
      }
    }
  }, [mode, assetId, processScan, toast])

  const handleAssignCustody = () => {
    if (!assetToAssign || !selectedCustodianId) return;

    const custodian = users.find(u => u.id === selectedCustodianId);
    if (!custodian) return;

    const updatedAsset = { ...assetToAssign, custodian };
    const assetIndex = assets.findIndex(a => a.id === assetToAssign.id);
    if (assetIndex !== -1) {
        assets[assetIndex] = updatedAsset;
    }

    toast({
        title: 'Custodian Assigned',
        description: `${custodian.name} has been assigned custody of ${assetToAssign.name}.`,
    });

    setIsAssignCustodyDialogOpen(false);
    setAssetToAssign(null);
    setInputValue("")
  };

  if (assetId) {
    if (!scannedAsset) return <ScanPageFallback />
    return (
      <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">{scannedAsset.name}</CardTitle>
            <CardDescription>{scannedAsset.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-center border rounded-lg space-y-2">
              {isUpdatingLocation ? (
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <p>Updating location...</p>
                </div>
              ) : updateError ? (
                <div className="p-4 text-destructive-foreground bg-destructive rounded-md">
                  <p className="font-semibold">Location Update Failed</p>
                  <p className="text-sm">{updateError}</p>
                </div>
              ) : (
                <>
                  <p><span className="font-semibold">Status:</span> {scannedAsset.status}</p>
                  <p><span className="font-semibold">Custodian:</span> {scannedAsset.custodian?.name || 'N/A'}</p>
                  <div className="text-sm text-muted-foreground pt-2">
                    <p className="font-semibold">Last scan:</p>
                    <p>{scannedAsset.location.address}</p>
                    <p><ClientDate date={scannedAsset.lastScan} /></p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={`/assets/${scannedAsset.id}`}>View Full Details</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/scan">Scan Another Asset</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full w-full -m-4 sm:-m-6 lg:-m-8">
        <header className="flex items-center justify-between p-2 sm:p-4 border-b">
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="w-[180px] sm:w-[220px]">
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="update_location">Update location</SelectItem>
              <SelectItem value="view_asset">View asset</SelectItem>
              <SelectItem value="assign_custody">Assign custody</SelectItem>
              <SelectItem value="release_custody" disabled>Release custody</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant={mode === 'scanner' ? 'secondary' : 'ghost'} onClick={() => setMode('scanner')}>
              <Scan className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Scanner</span>
            </Button>
            <Button variant={mode === 'camera' ? 'secondary' : 'ghost'} onClick={() => setMode('camera')}>
              <Camera className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Camera</span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-background">
          {mode === 'scanner' && (
            <div className="w-full max-w-md space-y-4">
              <QrCode className="mx-auto h-16 w-16 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Ready to Scan</h2>
              <p className="text-muted-foreground">Focus the field and use your barcode scanner, or paste the link below.</p>
              <Input
                type="text"
                placeholder="Scan or paste asset link here..."
                className="text-center h-12 text-base"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoFocus
              />
            </div>
          )}

          {mode === 'camera' && (
            <div className="w-full max-w-md space-y-4">
              <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center relative overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                {hasCameraPermission === null && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                    <p>Requesting camera...</p>
                  </div>
                )}
              </div>
              {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>Please allow camera access to use this feature.</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </main>
      </div>
      <Dialog open={isAssignCustodyDialogOpen} onOpenChange={setIsAssignCustodyDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Assign Custody for {assetToAssign?.name}</DialogTitle>
                <DialogDescription>
                    Select a user to assign custody of this asset to.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="custodian-select" className="mb-2 block">Custodian</Label>
                <Select onValueChange={setSelectedCustodianId} defaultValue={selectedCustodianId ?? undefined}>
                    <SelectTrigger id="custodian-select">
                        <SelectValue placeholder="Select a user..." />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => { setIsAssignCustodyDialogOpen(false); setAssetToAssign(null); }}>Cancel</Button>
                <Button onClick={handleAssignCustody} disabled={!selectedCustodianId}>Assign</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ScanPageFallback() {
    return (
        <div className="flex justify-center items-center h-full">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full mx-auto mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="p-4 text-center border rounded-lg space-y-2">
                        <Skeleton className="h-5 w-1/2 mx-auto" />
                        <Skeleton className="h-5 w-1/2 mx-auto" />
                        <div className="pt-2">
                            <Skeleton className="h-4 w-1/3 mx-auto" />
                            <Skeleton className="h-4 w-2/3 mx-auto mt-1" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        </div>
    )
}

export default function ScanPage() {
    return (
        <Suspense fallback={<ScanPageFallback />}>
            <ScanPageContent />
        </Suspense>
    )
}
