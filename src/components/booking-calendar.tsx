
"use client"

import * as React from "react"
import {
  isWithinInterval,
  startOfDay,
  endOfDay,
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  areIntervalsOverlapping,
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

interface BookingCalendarContextValue {
    bookings: Booking[];
    bookingLayout: Map<string, number>;
}

const BookingCalendarContext = React.createContext<BookingCalendarContextValue | null>(null);

function useBookingCalendarContext() {
    const context = React.useContext(BookingCalendarContext);
    if (!context) {
        throw new Error("useBookingCalendarContext must be used within a BookingCalendarContextProvider");
    }
    return context;
}

function DayWithBookings({ displayMonth, date }: DayProps) {
  const { bookings, bookingLayout } = useBookingCalendarContext()

  const bookingsForDay = React.useMemo(() => {
    return bookings.filter(
      (booking) =>
        (booking.status === "Active" || booking.status === "Upcoming") &&
        isWithinInterval(date, {
          start: startOfDay(new Date(booking.startDate)),
          end: endOfDay(new Date(booking.endDate)),
        })
    )
  }, [bookings, date])

  const isOutside = date.getMonth() !== displayMonth.getMonth();

  const MAX_TRACKS_TO_SHOW = 3

  const tracksForDay = React.useMemo(() => {
    const tracks = Array.from({ length: MAX_TRACKS_TO_SHOW }, () => null as Booking | null);
    bookingsForDay.forEach(booking => {
      const trackIndex = bookingLayout.get(booking.id);
      if (trackIndex !== undefined && trackIndex < MAX_TRACKS_TO_SHOW) {
        tracks[trackIndex] = booking;
      }
    });
    return tracks;
  }, [bookingsForDay, bookingLayout]);

  const hiddenBookingsCount = bookingsForDay.filter(b => (bookingLayout.get(b.id) ?? MAX_TRACKS_TO_SHOW) >= MAX_TRACKS_TO_SHOW).length;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-start",
        isOutside && "text-muted-foreground/50",
      )}
    >
      <time dateTime={format(date, 'yyyy-MM-dd')} className="p-1">{format(date, "d")}</time>
      {bookingsForDay.length > 0 && (
        <div className="absolute inset-x-0 top-7 flex w-full flex-1 flex-col gap-1">
          {tracksForDay.map((booking, trackIndex) => {
            if (!booking) {
              return <div key={trackIndex} className="h-4" />;
            }

            const bookingStart = startOfDay(new Date(booking.startDate))
            const bookingEnd = startOfDay(new Date(booking.endDate))
            const isStart = isSameDay(date, bookingStart)
            const isEnd = isSameDay(date, bookingEnd)

            return (
              <Tooltip key={booking.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "h-4 cursor-pointer w-[calc(100%+1px)] -ml-px",
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
          {hiddenBookingsCount > 0 && (
            <div className="text-xs text-muted-foreground mt-1 p-1">
              + {hiddenBookingsCount} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BookingCalendar({ bookings, month, onMonthChange, className }: BookingCalendarProps) {
  const [bookingLayout, setBookingLayout] = React.useState<Map<string, number>>(new Map());

  React.useEffect(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthBookings = bookings
        .filter(b => 
            (b.status === 'Active' || b.status === 'Upcoming') &&
            areIntervalsOverlapping(
                { start: new Date(b.startDate), end: new Date(b.endDate) },
                { start: monthStart, end: monthEnd }
            )
        )
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    const layout = new Map<string, number>();
    const tracks: Date[] = [];

    monthBookings.forEach(booking => {
        const bookingStart = new Date(booking.startDate);
        let assignedTrack = -1;

        for (let i = 0; i < tracks.length; i++) {
            if (bookingStart >= tracks[i]) {
                assignedTrack = i;
                break;
            }
        }

        if (assignedTrack === -1) {
            assignedTrack = tracks.length;
        }

        layout.set(booking.id, assignedTrack);
        tracks[assignedTrack] = endOfDay(new Date(booking.endDate));
    });

    setBookingLayout(layout);
  }, [bookings, month]);

  const contextValue = React.useMemo(() => ({ bookings, bookingLayout }), [bookings, bookingLayout]);
  
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
            cell: "h-24 md:h-32 w-full text-center text-sm p-0 relative border-r last:border-r-0",
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
