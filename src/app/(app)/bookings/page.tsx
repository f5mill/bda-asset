
"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, PlusCircle } from "lucide-react"

import { assets, bookings as initialBookings } from "@/lib/data"
import type { Booking, Asset, BookingStatus } from "@/lib/types"
import { getBookingStatusVariant } from "@/lib/utils"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ClientDate } from "@/components/client-date"

// Helper to get asset details from IDs
const getAssetsForBooking = (assetIds: string[]): Asset[] => {
  return assetIds.map(id => assets.find(asset => asset.id === id)).filter(Boolean) as Asset[]
}


function BookingsTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return <p className="p-6 text-center text-muted-foreground">No bookings to display in this view.</p>
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset(s)</TableHead>
          <TableHead>Booked By</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => {
          const bookedAssets = getAssetsForBooking(booking.assetIds)
          return (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex flex-col">
                  {bookedAssets.map((asset, index) => (
                    <Link key={asset.id} href={`/assets/${asset.id}`} className="font-medium hover:underline">
                      {asset.name}
                      {bookedAssets.length > 1 && index < bookedAssets.length -1 ? ', ' : ''}
                    </Link>
                  ))}
                  {bookedAssets.length === 0 && <span className="text-muted-foreground">Asset not found</span>}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{booking.bookedBy}</TableCell>
              <TableCell>
                <ClientDate date={booking.startDate} />
              </TableCell>
              <TableCell>
                <ClientDate date={booking.endDate} />
              </TableCell>
              <TableCell>
                <Badge variant={getBookingStatusVariant(booking.status) as any}>{booking.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Booking</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Cancel Booking</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)

  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.startDate) > now && (b.status === "Upcoming" || b.status === "Active"));
  const activeBookings = bookings.filter(b => new Date(b.startDate) <= now && new Date(b.endDate) >= now && b.status === "Active");
  const completedBookings = bookings.filter(b => new Date(b.endDate) < now || b.status === "Completed" || b.status === "Cancelled");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              Manage your asset bookings here.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Booking
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">History</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-4">
            <BookingsTable bookings={upcomingBookings} />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <BookingsTable bookings={activeBookings} />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <BookingsTable bookings={completedBookings} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
