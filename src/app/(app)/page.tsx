import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Box, CheckCircle, Wrench, ArrowRightLeft } from "lucide-react"
import { assets } from "@/lib/data"

export default function Dashboard() {
  const totalAssets = assets.length
  const availableAssets = assets.filter(a => a.status === 'Available').length
  const inRepairAssets = assets.filter(a => a.status === 'In Repair').length
  const checkedOutAssets = assets.filter(a => a.status === 'Checked Out').length

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              The total number of assets in your inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableAssets}</div>
            <p className="text-xs text-muted-foreground">
              Assets ready for checkout or booking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked Out</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedOutAssets}</div>
            <p className="text-xs text-muted-foreground">
              Assets currently assigned to custodians
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Repair</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inRepairAssets}</div>
            <p className="text-xs text-muted-foreground">
              Assets undergoing maintenance
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    A log of recent asset scans, check-ins, and updates.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">No recent activity to display.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
