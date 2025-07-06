
"use client"

import * as React from "react"
import {
  isWithinInterval,
  startOfDay,
  endOfDay,
  format,
} from "date-fns"
import type { DayProps } from "react-day-picker"
import Link from "next/link"

import type { Booking, Asset } from "@/lib/types"
import { cn } from "@/lib/utils"
import { assets } from "@/lib/data"
import { DayPicker } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { getBookingStatusVariant } from "@/lib/utils"

interface BookingCalendarProps {
  bookings: Booking[]
  month: Date
  onMonthChange: (date: Date) => void
  className?: string
}

const getAssetsForBooking = (assetIds: string[]): Asset[] => {
  return assetIds.map(id => assets.find(asset => asset.id === id)).filter(Boolean) as Asset[]
}

const BookingCalendarContext = React.createContext<{ bookings: Booking[] } | null>(null);

function useBookingCalendarContext() {
    const context = React.useContext(BookingCalendarContext);
    if (!context) {
        throw new Error("useBookingCalendarContext must be used within a BookingCalendarContextProvider");
    }
    return context;
}

function DayWithBookings({ displayMonth, date, ...props }: DayProps) {
  const { bookings } = useBookingCalendarContext()

  const bookingsForDay = React.useMemo(() => {
    return bookings.filter(
      (booking) =>
        (booking.status === "Active" || booking.status === "Upcoming") &&
        isWithinInterval(date, {
          start: startOfDay(new Date(booking.startDate)),
          end: endOfDay(new Date(booking.endDate)),
        })
    ).sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [bookings, date])

  const buttonContent = (
    <>
      <time dateTime={date.toISOString()}>{format(date, "d")}</time>
      {bookingsForDay.length > 0 && (
        <div className="flex w-full flex-1 flex-col gap-1 overflow-hidden pt-1">
          {bookingsForDay.slice(0, 3).map((booking) => (
            <div
              key={booking.id}
              className={cn(
                "w-full truncate rounded-sm px-1 text-left text-xs",
                {
                  "bg-primary text-primary-foreground": booking.status === "Active",
                  "bg-accent text-accent-foreground": booking.status === "Upcoming"
                }
              )}
            >
             • {booking.purpose}
            </div>
          ))}
          {bookingsForDay.length > 3 && (
            <div className="text-xs text-muted-foreground">
              + {bookingsForDay.length - 3} more
            </div>
          )}
        </div>
      )}
    </>
  );
  
  const isOutside = date.getMonth() !== displayMonth.getMonth();

  if (bookingsForDay.length > 0) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "relative h-full w-full flex-col items-start justify-start p-1.5 font-normal",
              isOutside && "text-muted-foreground opacity-70",
              props.className
            )}
            disabled={props.disabled}
          >
            {buttonContent}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-2">
            <h4 className="font-medium">
              Bookings for {format(date, "MMM d, yyyy")}
            </h4>
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {bookingsForDay.map((booking) => {
                const bookedAssets = getAssetsForBooking(booking.assetIds)
                return (
                  <Card key={booking.id} className="text-sm">
                    <CardHeader className="flex-row items-center justify-between p-2">
                      <div>
                        <CardTitle className="text-sm">{booking.purpose}</CardTitle>
                        <CardDescription>By: {booking.bookedBy}</CardDescription>
                      </div>
                      <Badge variant={getBookingStatusVariant(booking.status) as any} className="text-xs">
                        {booking.status}
                      </Badge>
                    </CardHeader>
                    {bookedAssets.length > 0 && 
                      <CardContent className="p-2 pt-0">
                          <p className="text-xs font-semibold">Asset(s):</p>
                          <ul className="space-y-1 text-xs">
                              {bookedAssets.map((asset) => (
                                  <li key={asset.id}>
                                      <Link href={`/assets/${asset.id}`} className="hover:underline">
                                          {asset.name}
                                      </Link>
                                  </li>
                              ))}
                          </ul>
                      </CardContent>
                    }
                  </Card>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <button
        type="button"
        className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-full w-full flex-col items-start justify-start p-1.5 font-normal",
            isOutside && "text-muted-foreground opacity-70",
            props.className
        )}
        disabled={props.disabled}
    >
      <time dateTime={date.toISOString()}>{format(date, "d")}</time>
    </button>
  )
}

export function BookingCalendar({ bookings, month, onMonthChange, className }: BookingCalendarProps) {
  const contextValue = React.useMemo(() => ({ bookings }), [bookings]);
  
  return (
    <BookingCalendarContext.Provider value={contextValue}>
      <DayPicker
        month={month}
        onMonthChange={onMonthChange}
        showOutsideDays
        fixedWeeks
        weekStartsOn={1}
        className={cn(className)}
        classNames={{
          month: "space-y-4",
          table: "w-full border-collapse",
          head_row: "flex border-b",
          head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] p-2 text-center",
          row: "flex w-full mt-0 border-b",
          cell: "h-32 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20 border-r last:border-r-0",
          day: "h-full w-full p-1",
          day_today: "bg-accent text-accent-foreground",
        }}
        components={{
          Day: DayWithBookings,
        }}
      />
    </BookingCalendarContext.Provider>
  )
}
