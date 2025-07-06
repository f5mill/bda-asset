import { FileDown, PlusCircle, Search } from "lucide-react"

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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCodeSvg } from "@/components/qr-code-svg"
import { ClientDate } from "@/components/client-date"

const generatedQRCodes = [
  { id: "QR-G1H2I3", createdAt: "2023-11-01T10:00:00Z", assignedTo: "ASSET-005" },
  { id: "QR-J4K5L6", createdAt: "2023-11-01T10:00:00Z", assignedTo: null },
  { id: "QR-M7N8P9", createdAt: "2023-11-01T10:00:00Z", assignedTo: null },
  { id: "QR-Q1R2S3", createdAt: "2023-10-31T15:20:00Z", assignedTo: "ASSET-002" },
  { id: "QR-T4U5V6", createdAt: "2023-10-31T15:20:00Z", assignedTo: "ASSET-001" },
];

export default function QRCodesPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generated QR Codes</CardTitle>
            <CardDescription>
              Manage, print, and assign QR codes to your assets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search QR codes..." className="pl-9" />
              </div>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export Unassigned
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Preview</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedQRCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <div className="w-10 h-10 p-1 bg-white rounded-md text-black">
                        <QrCodeSvg path={`/scan?id=${code.id}`} />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{code.id}</TableCell>
                    <TableCell>
                      {code.assignedTo ? (
                        <Badge variant="secondary">Assigned</Badge>
                      ) : (
                        <Badge>Unassigned</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <ClientDate date={code.createdAt} format="toLocaleDateString" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled={!!code.assignedTo}>
                        Assign to Asset
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Bulk Generate</CardTitle>
            <CardDescription>
              Create multiple new QR codes at once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" defaultValue="20" />
            </div>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Codes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
