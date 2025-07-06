import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LocationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Locations</CardTitle>
        <CardDescription>
          Manage your asset locations here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Location management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  )
}
