
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, PlusCircle, QrCode } from "lucide-react"

import { locations, assets as initialAssets } from "@/lib/data"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"

export default function LocationDetailsPage() {
  const params = useParams<{ id: string }>()
  const [allAssets, setAllAssets] = useState<Asset[]>(initialAssets)
  const [location, setLocation] = useState<Location | null>(null)
  const [assignedAssets, setAssignedAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false)
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      const foundLocation = locations.find((loc) => loc.id === params.id)
      if (foundLocation) {
        setLocation(foundLocation)
        const assetsInLocation = allAssets.filter(
          (asset) => asset.assignedLocation === foundLocation.name
        )
        setAssignedAssets(assetsInLocation)
      } else {
        setLocation(null)
      }
    }
    setIsLoading(false)
  }, [params.id, allAssets])

  const handleOpenDialog = () => {
    setSelectedAssetIds(assignedAssets.map((asset) => asset.id))
    setIsAddAssetDialogOpen(true)
  }

  const handleAssetSelection = (assetId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedAssetIds((prev) => [...prev, assetId])
    } else {
      setSelectedAssetIds((prev) => prev.filter((id) => id !== assetId))
    }
  }

  const handleSaveAssignments = () => {
    if (!location) return

    const updatedAssetsList = allAssets.map((asset) => {
      const isSelected = selectedAssetIds.includes(asset.id)
      const wasAssignedHere = asset.assignedLocation === location.name

      if (isSelected) {
        return { ...asset, assignedLocation: location.name }
      }
      if (wasAssignedHere && !isSelected) {
        return { ...asset, assignedLocation: "Unassigned" }
      }
      return asset
    })

    setAllAssets(updatedAssetsList)
    setIsAddAssetDialogOpen(false)
    toast({
      title: "Assets Updated",
      description: `Asset assignments for ${location.name} have been updated.`,
    })
  }

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
    <>
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
                <span className="font-medium">{location.address || "N/A"}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-start">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium">
                  {location.description || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assets at this Location</CardTitle>
                <CardDescription>
                  A list of all assets currently assigned to {location.name}.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleOpenDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Assign Assets
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/scan">
                    <QrCode className="mr-2 h-4 w-4" />
                    Scan to Add
                  </Link>
                </Button>
              </div>
            </div>
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
                        <Link
                          href={`/assets/${asset.id}`}
                          className="font-medium hover:underline"
                        >
                          {asset.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(asset.status) as any}>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {asset.custodian?.name || "N/A"}
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

      <Dialog open={isAddAssetDialogOpen} onOpenChange={setIsAddAssetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Assets to {location.name}</DialogTitle>
            <DialogDescription>
              Select assets to assign to this location. Unchecking an asset will
              remove it from this location.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            <div className="space-y-4">
              {allAssets.map((asset) => (
                <div key={asset.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`asset-${asset.id}`}
                    checked={selectedAssetIds.includes(asset.id)}
                    onCheckedChange={(checked) =>
                      handleAssetSelection(asset.id, !!checked)
                    }
                  />
                  <Label
                    htmlFor={`asset-${asset.id}`}
                    className="flex flex-col cursor-pointer"
                  >
                    <span className="font-medium">{asset.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {asset.id === 'ASSET-001' ? 'Currently at: Floor 5, Desk 21, Los Angeles Office' : `Status: ${asset.status}`}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddAssetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAssignments}>Save Assignments</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
