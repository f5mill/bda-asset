
"use client"

import * as React from "react"
import { eachDayOfInterval, startOfDay } from "date-fns"

import type { Booking } from "@/lib/types"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface BookingCalendarProps {
  bookings: Booking[]
  selectedDate: Date | undefined
  onDateChange: (date: Date | undefined) => void
  className?: string
}

export function BookingCalendar({ bookings, selectedDate, onDateChange, className }: BookingCalendarProps) {
  const bookedDays = React.useMemo(() => {
    const allBookedDays: Date[] = []
    bookings.forEach((booking) => {
      if (booking.status === "Active" || booking.status === "Upcoming") {
        try {
          const interval = {
            start: startOfDay(new Date(booking.startDate)),
            end: startOfDay(new Date(booking.endDate)),
          }
          if (interval.start > interval.end) return
          
          const daysInInterval = eachDayOfInterval(interval)
          allBookedDays.push(...daysInInterval)
        } catch (error) {
          console.error("Invalid date for booking:", booking.id, error)
        }
      }
    })
    
    const uniqueTimestamps = new Set(allBookedDays.map(d => d.getTime()))
    return Array.from(uniqueTimestamps).map(ts => new Date(ts))

  }, [bookings])

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onDateChange}
      modifiers={{ booked: bookedDays }}
      modifiersClassNames={{
        booked: "bg-accent text-accent-foreground",
      }}
      className={cn("w-full", className)}
    />
  )
}
