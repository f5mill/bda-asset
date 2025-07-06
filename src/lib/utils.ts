import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
