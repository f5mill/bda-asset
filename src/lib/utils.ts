import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BookingStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBadgeVariant = (status: string) => {
  switch (status) {
    case "Available":
      return "default"
    case "Checked Out":
      return "secondary"
    case "In Repair":
      return "destructive"
    case "Booked":
      return "outline"
    default:
      return "default"
  }
}

export const getBookingStatusVariant = (status: BookingStatus) => {
    switch (status) {
        case 'Active':
            return 'default'
        case 'Upcoming':
            return 'secondary'
        case 'Completed':
            return 'outline'
        case 'Cancelled':
            return 'destructive'
        default:
            return 'secondary'
    }
}
