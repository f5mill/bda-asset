import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function TagsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
        <CardDescription>
          Manage your asset tags here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Tag management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  )
}
