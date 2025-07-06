import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function UsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Manage your team members and their permissions here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">User management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  )
}
