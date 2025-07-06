import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  ChevronLeft,
  Edit,
  History,
  Info,
  MapPin,
  MoreVertical,
  QrCode,
} from "lucide-react"

import { assets } from "@/lib/data"
import { getBadgeVariant } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QrCodeSvg } from "@/components/qr-code-svg"
import { Separator } from "@/components/ui/separator"
import { ClientDate } from "@/components/client-date"

export default async function AssetDetailsPage({ params }: { params: { id: string } }) {
  const asset = assets.find((a) => a.id === params.id)

  if (!asset) {
    notFound()
  }

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          {asset.name}
        </h1>
        <Badge variant={getBadgeVariant(asset.status) as any} className="ml-auto sm:ml-0">
          {asset.status}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Check In/Out</DropdownMenuItem>
              <DropdownMenuItem>Assign Custodian</DropdownMenuItem>
              <DropdownMenuItem>View History</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <CardTitle>Asset Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <p className="text-muted-foreground">{asset.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">ID</div>
                    <div className="font-mono text-sm">{asset.id}</div>
                  </div>
                  <div className="grid gap-3">
                    <div className="font-semibold">Custodian</div>
                    {asset.custodian ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={asset.custodian.avatarUrl} alt={asset.custodian.name} data-ai-hint="person" />
                          <AvatarFallback>{asset.custodian.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{asset.custodian.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Last Scan</p>
                    <p className="text-sm text-muted-foreground">{asset.location.address}</p>
                  </div>
                  <p className="text-sm text-muted-foreground"><ClientDate date={asset.lastScan} /></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                <CardTitle>QR Code</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-white rounded-md text-black aspect-square">
                <QrCodeSvg path={`/scan?assetId=${asset.id}`} />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2 font-mono">{asset.qrCodeId}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <CardTitle>Last Known Location</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-md overflow-hidden bg-muted">
                <Image
                  src="https://placehold.co/400x300.png"
                  alt="Map of asset location"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                  data-ai-hint="map"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{asset.location.address}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" className="w-full">
            Edit
        </Button>
        <Button size="sm" className="w-full">
            Check In/Out
        </Button>
      </div>
    </div>
  )
}
