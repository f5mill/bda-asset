import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CategoriesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>
          Manage your asset categories here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Category management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  )
}
