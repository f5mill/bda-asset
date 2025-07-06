
"use client"

import { useState } from "react"
import { FileDown, PlusCircle, Search, UserPlus, MoreHorizontal, Printer } from "lucide-react"

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCodeSvg } from "@/components/qr-code-svg"
import { ClientDate } from "@/components/client-date"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const initialGeneratedQRCodes = [
  { id: "QR-G1H2I3", createdAt: "2023-11-01T10:00:00Z", assignedTo: "ASSET-005" },
  { id: "QR-J4K5L6", createdAt: "2023-11-01T10:00:00Z", assignedTo: null },
  { id: "QR-M7N8P9", createdAt: "2023-11-01T10:00:00Z", assignedTo: null },
  { id: "QR-Q1R2S3", createdAt: "2023-10-31T15:20:00Z", assignedTo: "ASSET-002" },
  { id: "QR-T4U5V6", createdAt: "2023-10-31T15:20:00Z", assignedTo: "ASSET-001" },
  { id: "QR-A1B2C4", createdAt: "2023-11-02T10:00:00Z", assignedTo: null },
  { id: "QR-D4E5F7", createdAt: "2023-11-02T10:00:00Z", assignedTo: null },
  { id: "QR-G7H8I0", createdAt: "2023-11-03T11:00:00Z", assignedTo: "ASSET-003" },
  { id: "QR-J1K2L4", createdAt: "2023-11-03T11:00:00Z", assignedTo: null },
  { id: "QR-M4N5P7", createdAt: "2023-11-04T12:00:00Z", assignedTo: null },
  { id: "QR-Q1R2S4", createdAt: "2023-11-04T12:00:00Z", assignedTo: "ASSET-004" },
  { id: "QR-T4U5V7", createdAt: "2023-11-05T13:00:00Z", assignedTo: null },
  { id: "QR-X7Y8Z9", createdAt: "2023-11-05T13:00:00Z", assignedTo: null },
  { id: "QR-1A2B3C", createdAt: "2023-11-06T14:00:00Z", assignedTo: null },
  { id: "QR-4D5E6F", createdAt: "2023-11-06T14:00:00Z", assignedTo: null },
].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const pendingInvites = [
  { id: "INV-001", email: "sara.n@example.com", sentAt: "2023-11-15T10:00:00Z", role: "Admin" },
  { id: "INV-002", email: "john.d@example.com", sentAt: "2023-11-14T14:30:00Z", role: "Member" },
  { id: "INV-003", email: "tech.team@example.com", sentAt: "2023-11-12T09:00:00Z", role: "Member" },
];

function QrCodeGenerationContent() {
    const [codes, setCodes] = useState(initialGeneratedQRCodes);
    const [quantity, setQuantity] = useState(20);
    const [newBatch, setNewBatch] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [dialogCurrentPage, setDialogCurrentPage] = useState(1);
    
    const CODES_PER_PAGE = 10;
    const DIALOG_CODES_PER_PAGE = 10; // For a 5-column grid, this is 2 rows

    // Main table pagination logic
    const indexOfLastCode = currentPage * CODES_PER_PAGE;
    const indexOfFirstCode = indexOfLastCode - CODES_PER_PAGE;
    const currentCodes = codes.slice(indexOfFirstCode, indexOfLastCode);
    const totalPages = Math.ceil(codes.length / CODES_PER_PAGE);

    // Dialog pagination logic
    const indexOfLastDialogCode = dialogCurrentPage * DIALOG_CODES_PER_PAGE;
    const indexOfFirstDialogCode = indexOfLastDialogCode - DIALOG_CODES_PER_PAGE;
    const currentDialogCodes = newBatch.slice(indexOfFirstDialogCode, indexOfLastDialogCode);
    const totalDialogPages = Math.ceil(newBatch.length / DIALOG_CODES_PER_PAGE);

    const handleGenerateBatch = () => {
      const batch = Array.from({ length: quantity }, () => {
        const id = `QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        return { id, createdAt: new Date().toISOString(), assignedTo: null };
      });
      setNewBatch(batch);
      setCodes(prev => [...batch, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setCurrentPage(1); // Go to first page to see new codes
      setDialogCurrentPage(1); // Reset dialog to first page
    };

    const handlePrint = () => {
      window.print();
    };

    return (
    <>
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
                  {currentCodes.map((code) => (
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
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {currentCodes.length > 0 ? indexOfFirstCode + 1 : 0} to {Math.min(indexOfLastCode, codes.length)} of {codes.length} codes.
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
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
                <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))} />
              </div>
              <Button className="w-full" onClick={handleGenerateBatch}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate & Print Batch
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={newBatch.length > 0} onOpenChange={(isOpen) => !isOpen && setNewBatch([])}>
        <DialogContent className="max-w-4xl">
            <div id="printable">
                <DialogHeader>
                    <DialogTitle>Generated QR Code Batch</DialogTitle>
                    <DialogDescription className="no-print">A batch of {newBatch.length} QR codes has been generated and added to your library. You can print them now.</DialogDescription>
                </DialogHeader>
                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {currentDialogCodes.map((code) => (
                        <div key={code.id} className="p-2 bg-white rounded-md text-black flex flex-col items-center justify-center text-center border break-inside-avoid">
                            <p className="font-bold text-sm font-mono">{code.id}</p>
                            <div className="w-24 h-24 p-1 mx-auto">
                                <QrCodeSvg path={`/scan?id=${code.id}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {totalDialogPages > 1 && (
                <div className="no-print flex items-center justify-between px-6">
                    <div className="text-sm text-muted-foreground">
                        Page {dialogCurrentPage} of {totalDialogPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDialogCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={dialogCurrentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDialogCurrentPage((prev) => Math.min(prev + 1, totalDialogPages))}
                            disabled={dialogCurrentPage === totalDialogPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
            <DialogFooter className="no-print pt-6">
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Batch
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function GeneralSettingsContent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage general application settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">General settings will be available here.</p>
            </CardContent>
        </Card>
    )
}

function BookingsSettingsContent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Booking Settings</CardTitle>
                <CardDescription>Manage booking-related settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Booking settings will be available here.</p>
            </CardContent>
        </Card>
    )
}

function TeamSettingsContent() {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>
                        Manage your team members, roles, and invites.
                    </CardDescription>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                </Button>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="users" className="w-full">
                    <TabsList>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="invites">Pending Invites</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users" className="mt-4">
                        <p className="text-muted-foreground">User management functionality will be implemented here.</p>
                    </TabsContent>
                    <TabsContent value="invites" className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Sent At</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingInvites.map((invite) => (
                                    <TableRow key={invite.id}>
                                        <TableCell className="font-medium">{invite.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{invite.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <ClientDate date={invite.sentAt} format="toLocaleDateString" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Revoke Invite</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default function SettingsPage() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-4">
        <GeneralSettingsContent />
      </TabsContent>
      <TabsContent value="qrcodes" className="mt-4">
        <QrCodeGenerationContent />
      </TabsContent>
      <TabsContent value="bookings" className="mt-4">
        <BookingsSettingsContent />
      </TabsContent>
      <TabsContent value="team" className="mt-4">
        <TeamSettingsContent />
      </TabsContent>
    </Tabs>
  )
}
