
"use client"

import { useState, useEffect } from "react"
import { FileDown, PlusCircle, Search, UserPlus, MoreHorizontal, Printer, Trash2, Eye, Pencil } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCodeSvg } from "@/components/qr-code-svg"
import { ClientDate } from "@/components/client-date"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


type QRBatch = {
  id: string;
  createdAt: string;
  quantity: number;
  codes: { id: string; assignedTo: string | null }[];
};

const initialBatches: QRBatch[] = [
  { id: 'BATCH-001', createdAt: '2023-11-06T14:00:00Z', quantity: 2, codes: [ { id: 'QR-1A2B3C', assignedTo: null }, { id: 'QR-4D5E6F', assignedTo: null } ] },
  { id: 'BATCH-002', createdAt: '2023-11-05T13:00:00Z', quantity: 2, codes: [ { id: 'QR-T4U5V7', assignedTo: null }, { id: 'QR-X7Y8Z9', assignedTo: null } ] },
  { id: 'BATCH-003', createdAt: '2023-11-04T12:00:00Z', quantity: 2, codes: [ { id: 'QR-M4N5P7', assignedTo: null }, { id: 'QR-Q1R2S4', assignedTo: 'ASSET-004' } ] },
  { id: 'BATCH-004', createdAt: '2023-11-03T11:00:00Z', quantity: 2, codes: [ { id: 'QR-G7H8I0', assignedTo: 'ASSET-003' }, { id: 'QR-J1K2L4', assignedTo: null } ] },
  { id: 'BATCH-005', createdAt: '2023-11-02T10:00:00Z', quantity: 2, codes: [ { id: 'QR-A1B2C4', assignedTo: null }, { id: 'QR-D4E5F7', assignedTo: null } ] },
  { id: 'BATCH-006', createdAt: '2023-11-01T10:00:00Z', quantity: 3, codes: [ { id: 'QR-G1H2I3', assignedTo: 'ASSET-005' }, { id: 'QR-J4K5L6', assignedTo: null }, { id: 'QR-M7N8P9', assignedTo: null } ] },
  { id: 'BATCH-007', createdAt: '2023-10-31T15:20:00Z', quantity: 2, codes: [ { id: 'QR-Q1R2S3', assignedTo: 'ASSET-002' }, { id: 'QR-T4U5V6', assignedTo: 'ASSET-001' } ] },
];


const pendingInvites = [
  { id: "INV-001", email: "sara.n@example.com", sentAt: "2023-11-15T10:00:00Z", role: "Admin" },
  { id: "INV-002", email: "john.d@example.com", sentAt: "2023-11-14T14:30:00Z", role: "Member" },
  { id: "INV-003", email: "tech.team@example.com", sentAt: "2023-11-12T09:00:00Z", role: "Member" },
];

function QrCodeGenerationContent() {
    const [batches, setBatches] = useState<QRBatch[]>(initialBatches);
    const [quantity, setQuantity] = useState(20);
    const [batchToPrint, setBatchToPrint] = useState<QRBatch | null>(null);
    const [batchToView, setBatchToView] = useState<QRBatch | null>(null);
    const [batchToDelete, setBatchToDelete] = useState<QRBatch | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const BATCHES_PER_PAGE = 5;
    
    const [viewCodesCurrentPage, setViewCodesCurrentPage] = useState(1);
    const CODES_PER_PAGE_VIEW = 10;
    
    const [dialogCurrentPage, setDialogCurrentPage] = useState(1);
    const DIALOG_CODES_PER_PAGE = 10;

    // Main table pagination
    const indexOfLastBatch = currentPage * BATCHES_PER_PAGE;
    const indexOfFirstBatch = indexOfLastBatch - BATCHES_PER_PAGE;
    const currentBatches = batches.slice(indexOfFirstBatch, indexOfLastBatch);
    const totalPages = Math.ceil(batches.length / BATCHES_PER_PAGE);

    // View Codes Dialog pagination
    const totalViewCodesPages = batchToView ? Math.ceil(batchToView.codes.length / CODES_PER_PAGE_VIEW) : 0;
    const currentViewCodes = batchToView?.codes.slice(
        (viewCodesCurrentPage - 1) * CODES_PER_PAGE_VIEW,
        viewCodesCurrentPage * CODES_PER_PAGE_VIEW
    );

    // Print Dialog pagination
    const codesToPaginate = batchToPrint?.codes || [];
    const totalDialogPages = Math.ceil(codesToPaginate.length / DIALOG_CODES_PER_PAGE);
    const currentDialogCodes = codesToPaginate.slice(
        (dialogCurrentPage - 1) * DIALOG_CODES_PER_PAGE,
        dialogCurrentPage * DIALOG_CODES_PER_PAGE
    );

    const handleGenerateBatch = () => {
        const newCodes = Array.from({ length: quantity }, () => ({
            id: `QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            assignedTo: null,
        }));
        
        const newBatch: QRBatch = {
            id: `BATCH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            quantity: quantity,
            codes: newCodes,
        };
      
        setBatches(prev => [newBatch, ...prev]);
        setBatchToPrint(newBatch);
        setCurrentPage(1);
        setDialogCurrentPage(1);
    };

    const handleDeleteBatch = () => {
        if (batchToDelete) {
            setBatches(batches.filter(b => b.id !== batchToDelete.id));
            setBatchToDelete(null);
        }
    }

    const handlePrint = () => {
      window.print();
    };

    return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">QR Code Batches</CardTitle>
              <CardDescription>
                Manage, print, and assign QR codes from generated batches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search batches..." className="pl-9" />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead className="hidden sm:table-cell">Created</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBatches.length > 0 ? currentBatches.map((batch) => {
                    const assignedCount = batch.codes.filter(c => c.assignedTo).length;
                    return (
                        <TableRow key={batch.id}>
                            <TableCell className="font-mono text-sm">{batch.id}</TableCell>
                            <TableCell className="hidden sm:table-cell"><ClientDate date={batch.createdAt} format="toLocaleDateString" /></TableCell>
                            <TableCell>{batch.quantity}</TableCell>
                            <TableCell>{assignedCount} / {batch.quantity}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => { setBatchToView(batch); setViewCodesCurrentPage(1); }}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Codes
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => { setBatchToPrint(batch); setDialogCurrentPage(1); }}>
                                            <Printer className="mr-2 h-4 w-4" />
                                            Print Batch
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onSelect={() => setBatchToDelete(batch)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Batch
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                  }) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No batches found.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {currentBatches.length > 0 ? indexOfFirstBatch + 1 : 0} to {Math.min(indexOfLastBatch, batches.length)} of {batches.length} batches.
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
                Create a new batch of QR codes.
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

      <Dialog open={!!batchToPrint} onOpenChange={(isOpen) => !isOpen && setBatchToPrint(null)}>
        <DialogContent className="max-w-4xl">
            <div id="printable">
                <DialogHeader>
                    <DialogTitle>Print Batch: {batchToPrint?.id}</DialogTitle>
                    <DialogDescription className="no-print">A batch of {batchToPrint?.quantity} QR codes has been generated. You can print them now.</DialogDescription>
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

      <Dialog open={!!batchToView} onOpenChange={(isOpen) => !isOpen && setBatchToView(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Codes in Batch: {batchToView?.id}</DialogTitle>
            <DialogDescription>
              Viewing {batchToView?.codes.length} codes. Unassigned codes can be linked to new assets.
            </DialogDescription>
          </DialogHeader>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-20">Preview</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {currentViewCodes?.map((code) => (
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
                        <TableCell className="text-right">
                        <Button variant="outline" size="sm" disabled={!!code.assignedTo}>
                            Assign to Asset
                        </Button>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
            </Table>
            {totalViewCodesPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {viewCodesCurrentPage} of {totalViewCodesPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewCodesCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={viewCodesCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewCodesCurrentPage((prev) => Math.min(prev + 1, totalViewCodesPages))}
                      disabled={viewCodesCurrentPage === totalViewCodesPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
            )}
          <DialogFooter className="pt-6">
            <DialogClose asChild>
                <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!batchToDelete} onOpenChange={(isOpen) => !isOpen && setBatchToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete batch <span className="font-mono font-medium">{batchToDelete?.id}</span> and its {batchToDelete?.quantity} QR codes. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteBatch}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function GeneralSettingsContent() {
    type Status = {
        id: number;
        name: string;
        variant: "default" | "secondary" | "destructive" | "outline";
    };

    const [statuses, setStatuses] = useState<Status[]>([
        { id: 1, name: "Available", variant: "default" },
        { id: 2, name: "Checked Out", variant: "secondary" },
        { id: 3, name: "In Repair", variant: "destructive" },
        { id: 4, name: "Booked", variant: "outline" },
    ]);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<Status | null>(null);
    const [statusToDelete, setStatusToDelete] = useState<Status | null>(null);

    const [newStatusName, setNewStatusName] = useState("");
    const [newStatusVariant, setNewStatusVariant] = useState<Status['variant']>("default");

    useEffect(() => {
        if (isStatusDialogOpen) {
            if (editingStatus) {
                setNewStatusName(editingStatus.name);
                setNewStatusVariant(editingStatus.variant);
            } else {
                setNewStatusName("");
                setNewStatusVariant("default");
            }
        }
    }, [isStatusDialogOpen, editingStatus]);

    const handleSaveStatus = () => {
        if (!newStatusName) return; // Basic validation
        const statusData = { name: newStatusName, variant: newStatusVariant };
        if (editingStatus) {
            setStatuses(statuses.map(s => s.id === editingStatus.id ? { ...s, ...statusData } : s));
        } else {
            setStatuses([...statuses, { id: Date.now(), ...statusData }]);
        }
        setIsStatusDialogOpen(false);
        setEditingStatus(null);
    };

    const handleDeleteStatus = () => {
        if (statusToDelete) {
            setStatuses(statuses.filter(s => s.id !== statusToDelete.id));
            setStatusToDelete(null);
        }
    };
    
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Workspace</CardTitle>
                    <CardDescription>Manage general application settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">General workspace settings will be available here.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Status Management</CardTitle>
                    <CardDescription>Define custom statuses for your assets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {statuses.map((status) => (
                            <div key={status.id} className="flex items-center justify-between p-3 rounded-lg border bg-background">
                                <Badge variant={status.variant}>{status.name}</Badge>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingStatus(status); setIsStatusDialogOpen(true); }}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setStatusToDelete(status)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => { setEditingStatus(null); setIsStatusDialogOpen(true); }}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Status
                    </Button>
                </CardFooter>
            </Card>

            <Dialog open={isStatusDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) setEditingStatus(null); setIsStatusDialogOpen(isOpen); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingStatus ? 'Edit' : 'Add New'} Status</DialogTitle>
                        <DialogDescription>
                            {editingStatus ? 'Update the details for this status.' : 'Create a new status for your assets.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status-name" className="text-right">Name</Label>
                            <Input id="status-name" value={newStatusName} onChange={(e) => setNewStatusName(e.target.value)} className="col-span-3" placeholder="e.g. On Loan" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status-variant" className="text-right">Color</Label>
                            <Select value={newStatusVariant} onValueChange={(value) => setNewStatusVariant(value as Status['variant'])}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Orange</SelectItem>
                                    <SelectItem value="secondary">Gray</SelectItem>
                                    <SelectItem value="destructive">Red</SelectItem>
                                    <SelectItem value="outline">Outline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSaveStatus}>Save Status</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!statusToDelete} onOpenChange={(isOpen) => !isOpen && setStatusToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the status "{statusToDelete?.name}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteStatus}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
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
                                    <TableHead className="hidden sm:table-cell">Sent At</TableHead>
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
                                        <TableCell className="hidden sm:table-cell">
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
