import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RemindersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminders</CardTitle>
        <CardDescription>
          Manage your asset reminders here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Reminder management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  )
}
