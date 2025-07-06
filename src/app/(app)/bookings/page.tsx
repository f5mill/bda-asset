import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function BookingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>
          Manage your asset bookings here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Booking management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  )
}
