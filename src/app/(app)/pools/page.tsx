import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function PoolsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Pools</CardTitle>
        <CardDescription>
          Combine related assets into cohesive groups, making it easier to manage and locate them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Pool management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  )
}
