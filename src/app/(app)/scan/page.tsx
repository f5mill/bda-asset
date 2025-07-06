"use client"
import { useState } from "react"
import { Camera, RefreshCw, X } from "lucide-react"
import Image from "next/image"

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
  const [isScanning, setIsScanning] = useState(false)
  const [scannedAsset, setScannedAsset] = useState<any>(null)

  const handleScan = () => {
    setIsScanning(true)
    // Simulate scanning
    setTimeout(() => {
      setScannedAsset({
        id: "ASSET-001",
        name: 'MacBook Pro 16"',
        description: "M2 Max, 64GB RAM, 2TB SSD. For engineering team.",
        status: "Checked Out",
        custodian: "Alice Johnson",
      })
      setIsScanning(false)
    }, 2000)
  }

  const handleReset = () => {
    setScannedAsset(null)
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Scan Asset QR Code</CardTitle>
          <CardDescription>
            Point your camera at a QR code to identify an asset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center relative overflow-hidden">
            {!scannedAsset ? (
              <>
                <Camera className="h-24 w-24 text-muted-foreground" />
                {isScanning && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-64 h-1 bg-primary/50 rounded-full overflow-hidden">
                      <div className="h-full bg-accent animate-scan-beam"></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold font-headline text-accent">{scannedAsset.name}</h3>
                    <p className="text-muted-foreground mt-2">{scannedAsset.description}</p>
                    <p className="mt-4"><span className="font-semibold">Status:</span> {scannedAsset.status}</p>
                    <p><span className="font-semibold">Custodian:</span> {scannedAsset.custodian}</p>
                </div>
            )}
            <style jsx>{`
              @keyframes scan-beam-anim {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              .animate-scan-beam {
                animation: scan-beam-anim 1.5s ease-in-out infinite;
              }
            `}</style>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {!scannedAsset ? (
            <Button onClick={handleScan} disabled={isScanning} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              {isScanning ? "Scanning..." : "Start Scan"}
            </Button>
          ) : (
            <>
              <Button onClick={handleReset} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan Another Asset
              </Button>
              <Button variant="outline" className="w-full">
                View Full Details
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
