"use client"

import * as React from "react"
import Link from "next/link"
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  ListFilter,
  File,
  Trash2,
  Share,
  Pencil,
  Tag,
  Copy,
} from "lucide-react"
import type { CheckedState } from "@radix-ui/react-checkbox"

import { assets } from "@/lib/data"
import { getBadgeVariant } from "@/lib/utils"
import type { Asset, AssetStatus } from "@/lib/types"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ClientDate } from "@/components/client-date"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { QrCodeSvg } from "@/components/qr-code-svg"


export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState("all")
  const [selectedAssets, setSelectedAssets] = React.useState<string[]>([])
  const [showLabelAsset, setShowLabelAsset] = React.useState<Asset | null>(null)

  const getFilteredAssets = (): Asset[] => {
    if (activeTab === "all") {
      return assets
    }
    const statusMap: { [key: string]: AssetStatus } = {
        'available': 'Available',
        'checked-out': 'Checked Out',
        'booked': 'Booked',
        'in-repair': 'In Repair'
    }
    return assets.filter(asset => asset.status === statusMap[activeTab])
  }

  const filteredAssets = getFilteredAssets()

  React.useEffect(() => {
    setSelectedAssets([]) 
  }, [activeTab])


  const handleSelectAll = (checked: CheckedState) => {
    if (checked === true) {
      setSelectedAssets(filteredAssets.map(asset => asset.id))
    } else {
      setSelectedAssets([])
    }
  }

  const handleSelectRow = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    )
  }

  const isAllSelected = filteredAssets.length > 0 && selectedAssets.length === filteredAssets.length
  const isSomeSelected = selectedAssets.length > 0 && selectedAssets.length < filteredAssets.length
  const checkedState = isAllSelected ? true : (isSomeSelected ? 'indeterminate' : false)

  return (
    <div className="space-y-4">
        <div className="flex items-center">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All Assets</TabsTrigger>
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="checked-out">Checked Out</TabsTrigger>
                    <TabsTrigger value="booked">Booked</TabsTrigger>
                    <TabsTrigger value="in-repair">In Repair</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                        </span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                            Status
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Custodian</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Location</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                    </span>
                </Button>
                <Link href="/assets/new">
                    <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Register Asset
                    </span>
                    </Button>
                </Link>
            </div>
        </div>
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search assets by name, ID, serial..." className="pl-9" />
                    </div>
                    {selectedAssets.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{selectedAssets.length} selected</span>
                            <Button variant="outline" size="sm"><Share className="mr-2 h-4 w-4" />Assign</Button>
                            <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                        </div>
                    )}
                </div>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-10">
                        <Checkbox 
                            onCheckedChange={handleSelectAll}
                            checked={checkedState}
                            aria-label="Select all"
                        />
                    </TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Custodian</TableHead>
                    <TableHead>Last Scan</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                        <TableRow key={asset.id} data-state={selectedAssets.includes(asset.id) ? "selected" : ""}>
                        <TableCell>
                            <Checkbox 
                            onCheckedChange={() => handleSelectRow(asset.id)}
                            checked={selectedAssets.includes(asset.id)}
                            aria-label={`Select asset ${asset.name}`}
                            />
                        </TableCell>
                        <TableCell>
                            <Link href={`/assets/${asset.id}`} className="font-medium hover:underline">{asset.name}</Link>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getBadgeVariant(asset.status) as any}>
                            {asset.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">
                            <ClientDate date={asset.lastScan} format="toLocaleDateString" />
                            </div>
                            <div className="text-sm text-muted-foreground">
                            {asset.location.address}
                            </div>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/assets/${asset.id}`}>View Details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Check In/Out</DropdownMenuItem>
                                <DropdownMenuItem>Assign Custodian</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowLabelAsset(asset)}>
                                    <Tag className="mr-2 h-4 w-4" />
                                    <span>Show Label</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    <span>Duplicate</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                        No assets found for this view.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
        {showLabelAsset && (
            <Dialog open={!!showLabelAsset} onOpenChange={(isOpen) => !isOpen && setShowLabelAsset(null)}>
                <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>Asset Label</DialogTitle>
                </DialogHeader>
                <div className="p-4 bg-white rounded-md text-black flex flex-col items-center justify-center text-center">
                    <p className="font-bold text-lg">{showLabelAsset.name}</p>
                    <div className="w-40 h-40 p-2 mx-auto">
                        <QrCodeSvg path={`/scan?assetId=${showLabelAsset.id}`} />
                    </div>
                    <p className="text-xs text-muted-foreground text-center font-mono">{showLabelAsset.qrCodeId}</p>
                </div>
                </DialogContent>
            </Dialog>
        )}
    </div>
  )
}
