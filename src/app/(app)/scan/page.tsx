
"use client"
import { useState, useEffect, Suspense, useCallback, useRef } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import jsQR from "jsqr"

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
import { Skeleton } from "@/components/ui/skeleton"
import { ClientDate } from "@/components/client-date"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function ScanPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null)
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const assetId = searchParams.get('assetId');

  const parseUserAgent = useCallback((ua: string) => {
    let browser = 'Unknown';
    let os = 'Unknown';
    let device = 'Desktop';

    if (/windows/i.test(ua)) os = 'Windows';
    else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
    else if (/linux/i.test(ua)) os = 'Linux';

    if (/edg/i.test(ua)) browser = 'Edge';
    else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) browser = 'Chrome';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    
    if (/mobi/i.test(ua)) device = 'Mobile';

    return { browser, os, device };
  }, []);

  const updateAssetLocation = useCallback((asset: Asset) => {
    setIsUpdatingLocation(true);
    setUpdateError(null);

    if (!navigator.geolocation) {
      const errorMsg = 'Your browser does not support geolocation.';
      toast({
        variant: 'destructive',
        title: 'Geolocation not supported',
        description: errorMsg,
      });
      setUpdateError(errorMsg);
      setIsUpdatingLocation(false);
      return;
    }

    const onSuccess = async (position: GeolocationPosition) => {
      try {
        const { latitude, longitude } = position.coords;
        const deviceInfo = parseUserAgent(navigator.userAgent);

        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch address from geocoding service.');
        }
        const data = await response.json();
        const newLocation = data.locality && data.principalSubdivision 
            ? `${data.locality}, ${data.principalSubdivision}` 
            : `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;

        const updatedAsset: Asset = {
            ...asset,
            location: {
                ...asset.location,
                lat: latitude,
                lng: longitude,
                address: newLocation,
            },
            lastScan: new Date().toISOString(),
            scanDetails: {
                ...deviceInfo,
                source: 'QR Code Scan'
            }
        };

        const assetIndex = assets.findIndex(a => a.id === asset.id);
        if (assetIndex !== -1) {
            assets[assetIndex] = updatedAsset;
        }

        setScannedAsset(updatedAsset);

        toast({
          title: 'Location Updated',
          description: `Asset location has been updated to: ${newLocation}`,
        });
      } catch (apiError: any) {
        const errorMsg = apiError.message || 'Could not fetch address data.';
        toast({
          variant: 'destructive',
          title: 'Geocoding Error',
          description: errorMsg,
        });
        setUpdateError(errorMsg);
      } finally {
        setIsUpdatingLocation(false);
      }
    };

    const onError = (error: GeolocationPositionError) => {
      let title = 'Geolocation Error';
      let description = 'Could not get your location.';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          description = 'You denied the request for Geolocation.';
          break;
        case error.POSITION_UNAVAILABLE:
          description = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          description = 'The request to get user location timed out.';
          break;
      }
      toast({ variant: 'destructive', title, description });
      setUpdateError(description);
      setIsUpdatingLocation(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  }, [toast, parseUserAgent]);

  useEffect(() => {
    if (assetId) {
      const assetData = assets.find((a) => a.id === assetId)
      if (assetData) {
        const assetCopy = JSON.parse(JSON.stringify(assetData));
        setScannedAsset(assetCopy)
        updateAssetLocation(assetCopy);
      } else {
        setScannedAsset(null)
        toast({
          variant: "destructive",
          title: "Asset not found",
          description: `No asset with ID ${assetId} exists.`,
        })
      }
    }
  }, [assetId, toast, updateAssetLocation]);

  useEffect(() => {
    if (!assetId) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const tick = () => {
        if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code) {
              try {
                const url = new URL(code.data);
            
                if (url.origin === window.location.origin && url.pathname === '/scan') {
                  const scannedQrId = url.searchParams.get('id');
            
                  if (scannedQrId) {
                    const asset = assets.find(a => a.qrCodeId === scannedQrId);
                    
                    // Stop scanning immediately after a valid QR is found
                    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                    if (videoRef.current && videoRef.current.srcObject) {
                        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                    }
            
                    if (asset) {
                      // Found the asset, redirect to scan page with assetId to update location.
                      router.push(`/scan?assetId=${asset.id}`);
                    } else {
                      // This QR code is valid but not assigned to any asset.
                      toast({
                          variant: "destructive",
                          title: "Unassigned QR Code",
                          description: `This QR code is not linked to any asset. You can link it from an asset's detail page.`,
                      });
                    }
                    return; // Exit tick loop
                  }
                }
              } catch (e) {
                // Not a valid URL or from a different domain, ignore and continue scanning.
              }
            }
          }
        }
        if (video?.srcObject) { // Only continue if camera is on
          animationFrameId.current = requestAnimationFrame(tick);
        }
      };

      const getCameraPermission = async () => {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera not supported on this browser.');
          }
          let stream;
          try {
            // Prefer the rear camera
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          } catch (e) {
            console.warn("Could not get rear camera, trying default camera.", e);
            // Fallback to any available camera if the rear one fails
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
          }

          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // Start the scanning loop after a short delay to allow camera to initialize
            setTimeout(() => {
              animationFrameId.current = requestAnimationFrame(tick);
            }, 100);
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          const errorMessage = (error as Error).message || 'Could not access the camera.';
          const errorTitle = (error as Error).name === 'NotAllowedError' ? 'Camera Access Denied' : 'Camera Error';
          const errorDescription = (error as Error).name === 'NotAllowedError' ? 'Please enable camera permissions in your browser settings to use this app.' : errorMessage;
          toast({
            variant: 'destructive',
            title: errorTitle,
            description: errorDescription,
          });
        }
      };

      getCameraPermission();

      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [assetId, toast, router]);

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
          <CardContent className="space-y-4">
            <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center relative overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              {hasCameraPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              )}
            </div>
            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser settings to use this feature.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
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
        <CardFooter className="flex flex-col gap-4">
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
