import Link from "next/link"
import {
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react"
import { assets } from "@/lib/data"
import { getBadgeVariant } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ClientDate } from "@/components/client-date"

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Assets</CardTitle>
          <CardDescription>
            Manage and track all your company's assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search assets..." className="pl-9" />
            </div>
            <Link href="/assets/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Register Asset
              </Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Custodian</TableHead>
                <TableHead>Last Scan</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <Link href={`/assets/${asset.id}`} className="font-medium hover:underline">{asset.name}</Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(asset.status) as any}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {asset.custodian ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={asset.custodian.avatarUrl} alt={asset.custodian.name} data-ai-hint="person" />
                          <AvatarFallback>{asset.custodian.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{asset.custodian.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      <ClientDate date={asset.lastScan} format="toLocaleDateString" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {asset.location.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/assets/${asset.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Check In/Out</DropdownMenuItem>
                        <DropdownMenuItem>Assign Custodian</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
