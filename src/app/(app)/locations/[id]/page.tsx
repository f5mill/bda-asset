
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { locations, assets } from "@/lib/data"
import { getBadgeVariant } from "@/lib/utils"
import type { Location, Asset } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function LocationDetailsPage() {
  const params = useParams<{ id: string }>()
  const [location, setLocation] = useState<Location | null>(null)
  const [assignedAssets, setAssignedAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const foundLocation = locations.find((loc) => loc.id === params.id)
      if (foundLocation) {
        setLocation(foundLocation)
        const assetsInLocation = assets.filter(
          (asset) => asset.assignedLocation === foundLocation.name
        )
        setAssignedAssets(assetsInLocation)
      } else {
        setLocation(null)
      }
    }
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Location Not Found</h1>
        <p className="text-muted-foreground">
          The location you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/locations">Back to Locations</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <Link href="/locations">
                <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
            </Link>
            <h1 className="text-xl font-semibold font-headline tracking-tight">
                {location.name}
            </h1>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="grid grid-cols-[120px_1fr] items-center">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium">{location.address || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-start">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium">{location.description || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assets at this Location</CardTitle>
          <CardDescription>
            A list of all assets currently assigned to {location.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Custodian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedAssets.length > 0 ? (
                assignedAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <Link href={`/assets/${asset.id}`} className="font-medium hover:underline">
                        {asset.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(asset.status) as any}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {asset.custodian?.name || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No assets assigned to this location.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
