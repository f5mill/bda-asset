
"use client"

import * as React from "react"
import {
  isWithinInterval,
  startOfDay,
  endOfDay,
  format,
  isSameDay,
} from "date-fns"
import type { DayProps } from "react-day-picker"

import type { Booking } from "@/lib/types"
import { cn } from "@/lib/utils"
import { DayPicker } from "react-day-picker"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BookingCalendarProps {
  bookings: Booking[]
  month: Date
  onMonthChange: (date: Date) => void
  className?: string
}

const BookingCalendarContext = React.createContext<{ bookings: Booking[] } | null>(null);

function useBookingCalendarContext() {
    const context = React.useContext(BookingCalendarContext);
    if (!context) {
        throw new Error("useBookingCalendarContext must be used within a BookingCalendarContextProvider");
    }
    return context;
}

function DayWithBookings({ displayMonth, date }: DayProps) {
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

  const isOutside = date.getMonth() !== displayMonth.getMonth();

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-start",
        isOutside && "text-muted-foreground/50",
      )}
    >
      <time dateTime={date.toISOString()} className="p-1">{format(date, "d")}</time>
      {bookingsForDay.length > 0 && (
        <div className="flex w-full flex-1 flex-col gap-1 overflow-hidden">
          {bookingsForDay.slice(0, 3).map((booking) => {
            const bookingStart = startOfDay(new Date(booking.startDate))
            const bookingEnd = startOfDay(new Date(booking.endDate))
            
            const isStart = isSameDay(date, bookingStart)
            const isEnd = isSameDay(date, bookingEnd)

            return (
              <Tooltip key={booking.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "w-full h-4 cursor-pointer",
                      {
                        "bg-primary": booking.status === "Active",
                        "bg-accent": booking.status === "Upcoming",
                      },
                      {
                        "rounded-l-sm": isStart,
                        "rounded-r-sm": isEnd,
                      }
                    )}
                  >
                    <span className="sr-only">{booking.purpose}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-semibold">{booking.purpose}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(bookingStart, "LLL d")} - {format(bookingEnd, "LLL d, yyyy")}
                    </p>
                    <p className="text-xs">Booked by: {booking.bookedBy}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
          {bookingsForDay.length > 3 && (
            <div className="text-xs text-muted-foreground px-1 mt-1">
              + {bookingsForDay.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BookingCalendar({ bookings, month, onMonthChange, className }: BookingCalendarProps) {
  const contextValue = React.useMemo(() => ({ bookings }), [bookings]);
  
  return (
    <BookingCalendarContext.Provider value={contextValue}>
      <TooltipProvider>
        <DayPicker
          month={month}
          onMonthChange={onMonthChange}
          showOutsideDays
          fixedWeeks
          weekStartsOn={1}
          className={cn(className)}
          classNames={{
            month: "space-y-4",
            caption: "hidden",
            table: "w-full border-collapse",
            head_row: "flex border-b",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] p-2 text-center",
            row: "flex w-full mt-0 border-b",
            cell: "h-32 w-full text-center text-sm p-0 relative border-r last:border-r-0",
            day: "h-full w-full",
            day_today: "bg-accent text-accent-foreground",
          }}
          components={{
            Day: DayWithBookings,
          }}
        />
      </TooltipProvider>
    </BookingCalendarContext.Provider>
  )
}
