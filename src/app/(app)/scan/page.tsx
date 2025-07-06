
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Camera, MapPin } from "lucide-react"

import { assets } from "@/lib/data"
import type { Asset } from "@/lib/types"
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

export default function ScanPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [assetId, setAssetId] = useState<string | null>(null)
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [updatedLocation, setUpdatedLocation] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('assetId')
    if (id) {
      setAssetId(id)
      const assetData = assets.find((a) => a.id === id)
      if (assetData) {
        setScannedAsset(JSON.parse(JSON.stringify(assetData))) // Deep copy to allow modification
      } else {
        setScannedAsset(null)
        toast({
          variant: "destructive",
          title: "Asset not found",
          description: `No asset with ID ${id} exists.`,
        })
      }
    }
  }, [searchParams, toast])

  const handleUpdateLocation = () => {
    setIsProcessing(true)

    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
      })
      setIsProcessing(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
          if (!response.ok) {
            throw new Error('Failed to fetch address from geocoding service.');
          }
          const data = await response.json();
          
          const newLocation = data.display_name || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;

          if (scannedAsset) {
            // This only updates the state locally. A real app would send this to a server.
            setScannedAsset(prevAsset => {
              if (!prevAsset) return null
              return {
                ...prevAsset,
                location: {
                  ...prevAsset.location,
                  lat: latitude,
                  lng: longitude,
                  address: newLocation,
                },
                lastScan: new Date().toISOString(),
              }
            })
            setUpdatedLocation(newLocation)
          }

          toast({
            title: "Location Updated",
            description: `Asset location has been updated to your current position.`,
          })
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Could not get address",
            description: "Failed to retrieve a street address for your current location.",
          })
        } finally {
          setIsProcessing(false)
        }
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Geolocation Error",
          description: error.message,
        })
        setIsProcessing(false)
      }
    )
  }

  if (!assetId) {
    return (
        <div className="flex justify-center items-center h-full">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Scan Asset QR Code</CardTitle>
                <CardDescription>
                    Point your device's camera at an asset's QR code.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center relative overflow-hidden">
                    <Camera className="h-24 w-24 text-muted-foreground" />
                </div>
                </CardContent>
                 <CardFooter>
                    <p className="text-sm text-muted-foreground text-center w-full">This is a simulation. To test, scan a QR code from an asset's detail page or append `?assetId=...` to the URL.</p>
                </CardFooter>
            </Card>
        </div>
    )
  }

  if (!scannedAsset) {
      return (
        <div className="flex justify-center items-center h-full">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Asset Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The asset ID provided in the URL does not exist.</p>
                </CardContent>
                <CardFooter>
                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full">Back to Dashboard</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
      )
  }


  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">{scannedAsset.name}</CardTitle>
          <CardDescription>
            {scannedAsset.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-4 text-center border rounded-lg space-y-2">
                <p><span className="font-semibold">Status:</span> {scannedAsset.status}</p>
                <p><span className="font-semibold">Custodian:</span> {scannedAsset.custodian?.name || 'N/A'}</p>
                <p className="text-sm text-muted-foreground pt-2">
                    <span className="font-semibold">Last known location:</span><br/>
                    {updatedLocation || scannedAsset.location.address}
                </p>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button onClick={handleUpdateLocation} disabled={isProcessing} className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                {isProcessing ? "Updating..." : "Update Location"}
            </Button>
            <Link href={`/assets/${scannedAsset.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Full Details
              </Button>
            </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
