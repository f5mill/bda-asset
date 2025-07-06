
"use client"

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { locations as initialLocations, assets } from "@/lib/data";
import type { Location } from "@/lib/types";

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const { toast } = useToast();

  const handleOpenDialog = (location: Location | null) => {
    setEditingLocation(location);
    setName(location?.name || "");
    setAddress(location?.address || "");
    setDescription(location?.description || "");
    setIsDialogOpen(true);
  };
  
  const handleSaveLocation = () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Location name is required.",
      });
      return;
    }

    if (editingLocation) {
      setLocations(
        locations.map((loc) =>
          loc.id === editingLocation.id
            ? { ...loc, name: name.trim(), address: address.trim(), description: description.trim() }
            : loc
        )
      );
      toast({ title: "Location Updated", description: `Location "${name}" has been updated.` });
    } else {
      const newLocation: Location = {
        id: `LOC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        name: name.trim(),
        address: address.trim(),
        description: description.trim(),
      };
      setLocations([newLocation, ...locations]);
      toast({ title: "Location Created", description: `New location "${name}" has been added.` });
    }

    setIsDialogOpen(false);
  };
  
  const handleDeleteLocation = () => {
    if (locationToDelete) {
        setLocations(locations.filter(loc => loc.id !== locationToDelete.id));
        toast({ title: "Location Deleted", description: `Location "${locationToDelete.name}" has been deleted.` });
        setLocationToDelete(null);
    }
  }

  const locationsWithAssetCounts = locations.map(location => ({
    ...location,
    assetCount: assets.filter(asset => asset.assignedLocation === location.name).length
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <div>
                  <CardTitle>Locations</CardTitle>
                  <CardDescription>
                  Manage the fixed locations where assets are stored.
                  </CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Location
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Assets</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationsWithAssetCounts.length > 0 ? (
                locationsWithAssetCounts.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">
                      <Link href={`/locations/${location.id}`} className="hover:underline">
                        {location.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{location.address || "N/A"}</TableCell>
                    <TableCell className="text-muted-foreground">{location.assetCount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(location)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setLocationToDelete(location)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No locations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                  <DialogTitle>{editingLocation ? "Edit Location" : "Create New Location"}</DialogTitle>
                  <DialogDescription>
                      {editingLocation ? "Update the details for this location." : "Fill in the information for the new location."}
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g. Main Office, Floor 3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">Address</Label>
                      <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" placeholder="(Optional) 123 Main St..." />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right mt-2">Description</Label>
                      <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 min-h-[80px]" placeholder="(Optional) Describe the location..." />
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveLocation}>Save Location</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!locationToDelete} onOpenChange={setLocationToDelete}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the "{locationToDelete?.name}" location.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setLocationToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteLocation}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
