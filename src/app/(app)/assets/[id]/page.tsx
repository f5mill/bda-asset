
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import {
  AlarmClock,
  CalendarCheck,
  CalendarPlus,
  ChevronLeft,
  Copy,
  Crosshair,
  Download,
  ExternalLink,
  MapPin,
  Pencil,
  Printer,
  QrCode,
  Tag,
  Trash2,
  UserRoundPlus,
} from "lucide-react"

import { assets, bookings as initialBookings, locations, qrBatches, users } from "@/lib/data"
import { getBadgeVariant } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { QrCodeSvg } from "@/components/qr-code-svg"
import { ClientDate } from "@/components/client-date"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Asset, Booking, QRCode, User } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function AssetDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [asset, setAsset] = useState<Asset | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isAddToBookingDialogOpen, setIsAddToBookingDialogOpen] = useState(false);
  const [isLinkQrDialogOpen, setIsLinkQrDialogOpen] = useState(false);
  const [isAssignCustodyDialogOpen, setIsAssignCustodyDialogOpen] = useState(false);
  const [availableQrCodes, setAvailableQrCodes] = useState<QRCode[]>([]);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [newAssignedLocation, setNewAssignedLocation] = useState("");
  const [selectedCustodianId, setSelectedCustodianId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      const assetData = assets.find((a) => a.id === params.id)
      if (assetData) {
        const assetWithDefaults = {
            ...assetData,
            isBookable: assetData.isBookable ?? true,
        };
        setAsset(JSON.parse(JSON.stringify(assetWithDefaults)))
      }
    }
    setIsLoading(false);
  }, [params.id])

  const parseUserAgent = (ua: string) => {
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
  }
  
  const handleUpdateGps = () => {
    setIsProcessing(true);

    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation.',
      });
      setIsProcessing(false);
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

        setAsset((prevAsset) => {
          if (!prevAsset) return null;
          // In a real app, this would also trigger a database update.
          return {
            ...prevAsset,
            location: {
              ...prevAsset.location,
              lat: latitude,
              lng: longitude,
              address: newLocation,
            },
            lastScan: new Date().toISOString(),
            scanDetails: {
              ...deviceInfo,
              source: 'GPS Update'
            }
          };
        });

        toast({
          title: 'Location Updated',
          description: `Asset location has been updated to: ${newLocation}`,
        });
      } catch (apiError: any) {
        toast({
          variant: 'destructive',
          title: 'Geocoding Error',
          description: apiError.message || 'Could not fetch address data.',
        });
      } finally {
        setIsProcessing(false);
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
      setIsProcessing(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  };

  const handleUpdateAssignedLocation = () => {
    if (!asset || !newAssignedLocation) return;
    // In a real app, this would also trigger a database update.
    setAsset(prevAsset => {
        if (!prevAsset) return null;
        return { ...prevAsset, assignedLocation: newAssignedLocation };
    });
    toast({
        title: 'Assigned Location Updated',
        description: `Asset assigned location has been updated to: ${newAssignedLocation}`,
    });
    setIsLocationDialogOpen(false);
  };
  
  const handleAddToBooking = () => {
    if (!selectedBookingId || !asset) return;

    const bookingToAdd = bookings.find(b => b.id === selectedBookingId);
    if (bookingToAdd && bookingToAdd.assetIds.includes(asset.id)) {
        toast({
            variant: "destructive",
            title: "Asset Already Booked",
            description: `${asset.name} is already part of this booking.`,
        });
        return;
    }

    // In a real app, this would be a database update.
    // Here, we just update the local state for demonstration.
    setBookings(prevBookings => 
        prevBookings.map(b => 
            b.id === selectedBookingId 
            ? { ...b, assetIds: [...b.assetIds, asset.id] }
            : b
        )
    );

    toast({
        title: "Asset Added to Booking",
        description: `${asset.name} has been added to booking: ${bookingToAdd?.purpose}.`,
    });
    setIsAddToBookingDialogOpen(false);
    setSelectedBookingId(null);
  };

  const handleToggleBookable = (isBookable: boolean) => {
    if (!asset) return;
    // In a real app, this would also trigger a database update.
    setAsset(prevAsset => {
        if (!prevAsset) return null;
        return { ...prevAsset, isBookable };
    });
    toast({
        title: 'Booking Availability Updated',
        description: `${asset.name} is now ${isBookable ? 'available' : 'unavailable'} for bookings.`,
    });
  };

  const handleLinkQrCode = () => {
    if (!asset || !selectedQrCode) return;

    const oldQrCodeId = asset.qrCodeId;

    // 1. Unassign the old QR code from its asset in the main `assets` array
    if (oldQrCodeId) {
        for (const batch of qrBatches) {
            const code = batch.codes.find(c => c.id === oldQrCodeId);
            if (code) {
                code.assignedTo = null;
                break;
            }
        }
    }

    // 2. Assign the new QR code to this asset
    for (const batch of qrBatches) {
        const code = batch.codes.find(c => c.id === selectedQrCode);
        if (code) {
            code.assignedTo = asset.id;
            break;
        }
    }

    // 3. Update the asset's qrCodeId in component state
    const updatedAsset = { ...asset, qrCodeId: selectedQrCode };
    setAsset(updatedAsset);

    // 4. Update the asset in the main `assets` array to persist change across navigation
    const assetIndex = assets.findIndex(a => a.id === asset.id);
    if (assetIndex > -1) {
        assets[assetIndex] = updatedAsset;
    }

    toast({
        title: "QR Code Linked",
        description: `Asset ${asset.name} is now linked to QR code ${selectedQrCode}.`,
    });

    setIsLinkQrDialogOpen(false);
  };
  
  const handleAssignCustody = () => {
    if (!asset || !selectedCustodianId) return;

    const custodian = users.find(u => u.id === selectedCustodianId);
    if (!custodian) {
        toast({ variant: 'destructive', title: 'Error', description: 'Selected custodian not found.' });
        return;
    }
    
    const updatedAsset = { ...asset, custodian };
    setAsset(updatedAsset);

    const assetIndex = assets.findIndex(a => a.id === asset.id);
    if (assetIndex > -1) {
        assets[assetIndex] = updatedAsset;
    }

    toast({
        title: "Custodian Assigned",
        description: `${custodian.name} has been assigned custody of ${asset.name}.`,
    });

    setIsAssignCustodyDialogOpen(false);
  };

  const upcomingAndActiveBookings = bookings.filter(b => b.status === 'Upcoming' || b.status === 'Active');
  
  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Link href="/assets">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold font-headline tracking-tight">
            Asset Not Found
        </h1>
      </div>
      <Card>
          <CardContent>
              <p className="p-6 text-muted-foreground">The asset you are looking for does not exist.</p>
          </CardContent>
      </Card>
    </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Link href="/assets">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex flex-shrink min-w-0 items-baseline gap-2">
            <h1 className="truncate text-xl font-semibold font-headline tracking-tight">
                {asset.name}
            </h1>
            <Badge variant={getBadgeVariant(asset.status) as any} className="flex-shrink-0">
                {asset.status}
            </Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => {
                if(asset) {
                    setSelectedCustodianId(asset.custodian?.id ?? null)
                    setIsAssignCustodyDialogOpen(true)
                }
              }}>
                <UserRoundPlus className="mr-2 h-4 w-4" />
                <span>Assign custody</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUpdateGps} disabled={isProcessing}>
                <Crosshair className="mr-2 h-4 w-4" />
                <span>{isProcessing ? "Updating..." : "Update GPS coordinates"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                if (asset) {
                    setNewAssignedLocation(asset.assignedLocation);
                    setIsLocationDialogOpen(true);
                }
                }}>
                <MapPin className="mr-2 h-4 w-4" />
                <span>Edit assigned location</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => {
                if (asset) {
                    const unassignedCodes = qrBatches
                        .flatMap(batch => batch.codes)
                        .filter(code => code.assignedTo === null);
                    
                    const currentCodeObject = qrBatches
                        .flatMap(batch => batch.codes)
                        .find(code => code.id === asset.qrCodeId);

                    const codesForSelect = [...unassignedCodes];
                    if (currentCodeObject && !codesForSelect.find(c => c.id === currentCodeObject.id)) {
                        codesForSelect.unshift(currentCodeObject);
                    }

                    setAvailableQrCodes(codesForSelect);
                    setSelectedQrCode(asset.qrCodeId);
                    setIsLinkQrDialogOpen(true);
                }
              }}>
                <QrCode className="mr-2 h-4 w-4" />
                <span>Relink QR Code</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <AlarmClock className="mr-2 h-4 w-4" />
                <span>Set reminder</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={!asset.isBookable}>Book</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => router.push(`/bookings/new?assetId=${asset.id}`)}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                <span>Create new booking</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsAddToBookingDialogOpen(true)}>
                <CalendarCheck className="mr-2 h-4 w-4" />
                <span>Add to existing booking</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
               <Card className="mt-4">
                <CardContent className="p-6">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm text-muted-foreground">ID</span>
                        <span className="font-mono text-sm">{asset.id}</span>
                    </div>
                     <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm text-muted-foreground">Created</span>
                         <span className="text-sm"><ClientDate date={asset.lastScan} format="toLocaleDateString" /></span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm text-muted-foreground">Assigned Location</span>
                        <span className="text-sm font-medium">{asset.assignedLocation}</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="outline">Uncategorized</Badge>
                    </div>
                  </div>
                </CardContent>
               </Card>
            </TabsContent>
            <TabsContent value="activity">
                <Card className="mt-4">
                    <CardContent>
                        <p className="p-6 text-muted-foreground">No activity to display.</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="bookings">
                <Card className="mt-4">
                    <CardContent>
                        <p className="p-6 text-muted-foreground">No bookings to display.</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="reminders">
                <Card className="mt-4">
                    <CardContent>
                        <p className="p-6 text-muted-foreground">No reminders to display.</p>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Available for bookings</h3>
                            <p className="text-sm text-muted-foreground">Asset is available for being used in bookings.</p>
                        </div>
                        <Switch 
                            id="booking-availability"
                            checked={asset.isBookable}
                            onCheckedChange={handleToggleBookable}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <div className="p-4 bg-white rounded-md text-black flex flex-col items-center justify-center text-center">
                        <p className="font-bold text-lg">{asset.name}</p>
                        <div className="w-40 h-40 p-2 mx-auto">
                           <QrCodeSvg path={`/scan?id=${asset.qrCodeId}`} />
                        </div>
                        <p className="text-xs text-muted-foreground text-center font-mono">{asset.qrCodeId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Download</Button>
                        <Button variant="outline"><Printer className="mr-2 h-4 w-4" />Print</Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Last Scan Details</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="h-48 w-full rounded-t-lg overflow-hidden bg-muted">
                        {asset.location.lat && asset.location.lng && process.env.NEXT_PUBLIC_MAPTILER_KEY ? (
                            <Image
                                src={`https://api.maptiler.com/maps/streets-v2/static/${asset.location.lng},${asset.location.lat},14/350x192.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
                                alt="Map of asset location"
                                width={350}
                                height={192}
                                className="object-cover w-full h-full"
                                data-ai-hint="map"
                                key={`${asset.location.lat}-${asset.location.lng}`}
                                onError={(e) => {
                                    e.currentTarget.onerror = null; // prevents looping
                                    e.currentTarget.src = "https://placehold.co/350x192.png";
                                }}
                            />
                        ) : (
                            <Image
                                src="https://placehold.co/350x192.png"
                                alt="Map of asset location"
                                width={350}
                                height={192}
                                className="object-cover w-full h-full"
                                data-ai-hint="map"
                            />
                        )}
                    </div>
                    <div className="p-4 space-y-2 text-sm">
                        <div className="flex justify-between items-start gap-2">
                            <span className="text-muted-foreground flex-shrink-0">Location</span>
                            <span className="text-right font-medium">{asset.location.address}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date/Time</span>
                            <span className="font-medium"><ClientDate date={asset.lastScan} /></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Coordinates</span> 
                            <span className="font-mono">{asset.location.lat.toFixed(6)}, {asset.location.lng.toFixed(6)}</span>
                        </div>
                         <div className="flex justify-between">
                             <span className="text-muted-foreground">Custodian</span>
                             <span className="font-medium">{ asset.custodian?.name || 'Unassigned' }</span>
                         </div>
                         {asset.scanDetails && (
                            <>
                                <Separator className="my-2" />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Device</span>
                                    <span className="font-medium">{asset.scanDetails.device}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">OS</span>
                                    <span className="font-medium">{asset.scanDetails.os}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Browser</span>
                                    <span className="font-medium">{asset.scanDetails.browser}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Source</span>
                                    <span className="font-medium">{asset.scanDetails.source}</span>
                                </div>
                            </>
                         )}
                    </div>
                </CardContent>
                <CardFooter>
                    <a href={`https://www.google.com/maps?q=${asset.location.lat},${asset.location.lng}`} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            See in Google Maps
                        </Button>
                    </a>
                </CardFooter>
            </Card>
        </div>
      </div>
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Assigned Location</DialogTitle>
                <DialogDescription>
                    Update the fixed location where this asset should be stored. This does not affect the last scanned GPS coordinates.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assigned-location" className="text-right">
                        Location
                    </Label>
                    <Select
                        value={newAssignedLocation}
                        onValueChange={setNewAssignedLocation}
                    >
                        <SelectTrigger id="assigned-location" className="col-span-3">
                            <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((location) => (
                                <SelectItem key={location.id} value={location.name}>
                                    {location.name}
                                </SelectItem>
                            ))}
                            <SelectItem value="Unassigned">Unassigned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateAssignedLocation}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
       <Dialog open={isAddToBookingDialogOpen} onOpenChange={setIsAddToBookingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add to Existing Booking</DialogTitle>
                <DialogDescription>
                    Select a booking to add "{asset.name}" to.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Select onValueChange={setSelectedBookingId} defaultValue={selectedBookingId || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a booking..." />
                  </SelectTrigger>
                  <SelectContent>
                    {upcomingAndActiveBookings.length > 0 ? (
                      upcomingAndActiveBookings.map(booking => (
                        <SelectItem key={booking.id} value={booking.id}>
                          {booking.purpose} ({new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()})
                        </SelectItem>
                      ))
                    ) : (
                      <p className="p-4 text-sm text-muted-foreground">No active or upcoming bookings.</p>
                    )}
                  </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddToBookingDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddToBooking} disabled={!selectedBookingId}>Add to Booking</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isLinkQrDialogOpen} onOpenChange={setIsLinkQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Link QR Code to {asset.name}</DialogTitle>
                <DialogDescription>
                    Select an unassigned QR code to link to this asset. This will replace the current QR code.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="qr-code-select">Available QR Codes</Label>
                <Select onValueChange={setSelectedQrCode} defaultValue={selectedQrCode ?? undefined}>
                    <SelectTrigger id="qr-code-select">
                        <SelectValue placeholder="Select a QR code..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availableQrCodes.length > 0 ? (
                            availableQrCodes.map(code => (
                                <SelectItem key={code.id} value={code.id}>
                                    {code.id}
                                </SelectItem>
                            ))
                        ) : (
                           <div className="p-4 text-center text-sm text-muted-foreground">No unassigned QR codes available.</div>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsLinkQrDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleLinkQrCode} disabled={!selectedQrCode || selectedQrCode === asset.qrCodeId}>Link QR Code</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAssignCustodyDialogOpen} onOpenChange={setIsAssignCustodyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Assign Custody for {asset.name}</DialogTitle>
                <DialogDescription>
                    Select a user to assign custody of this asset to.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="custodian" className="text-right">
                        Custodian
                    </Label>
                    <Select
                        value={selectedCustodianId ?? undefined}
                        onValueChange={setSelectedCustodianId}
                    >
                        <SelectTrigger id="custodian" className="col-span-3">
                            <SelectValue placeholder="Select a custodian" />
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
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignCustodyDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAssignCustody} disabled={!selectedCustodianId}>Assign Custody</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
