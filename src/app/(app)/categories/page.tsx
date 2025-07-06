"use client"

import { useState } from "react";
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
import { categories as initialCategories, assets } from "@/lib/data";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6b7280"); // Default color

  const { toast } = useToast();

  const handleOpenDialog = (category: Category | null) => {
    setEditingCategory(category);
    setName(category?.name || "");
    setDescription(category?.description || "");
    setColor(category?.color || "#6b7280");
    setIsDialogOpen(true);
  };
  
  const handleSaveCategory = () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Category name is required.",
      });
      return;
    }

    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, name: name.trim(), description: description.trim(), color }
            : cat
        )
      );
      toast({ title: "Category Updated", description: `Category "${name}" has been updated.` });
    } else {
      const newCategory: Category = {
        id: `CAT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        name: name.trim(),
        description: description.trim(),
        color,
      };
      setCategories([newCategory, ...categories]);
      toast({ title: "Category Created", description: `New category "${name}" has been added.` });
    }

    setIsDialogOpen(false);
  };
  
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
        setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
        toast({ title: "Category Deleted", description: `Category "${categoryToDelete.name}" has been deleted.` });
        setCategoryToDelete(null);
    }
  }

  const categoriesWithAssetCounts = categories.map(category => ({
    ...category,
    assetCount: assets.filter(asset => asset.categoryId === category.id).length
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <div>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>
                  Group your assets into categories for better organization.
                  </CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Category
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assets</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesWithAssetCounts.length > 0 ? (
                categoriesWithAssetCounts.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span>{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{category.description || "N/A"}</TableCell>
                    <TableCell className="text-muted-foreground">{category.assetCount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setCategoryToDelete(category)}>
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
                    No categories found.
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
                  <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
                  <DialogDescription>
                      {editingCategory ? "Update the details for this category." : "Fill in the information for the new category."}
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g. Electronics" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right mt-2">Description</Label>
                      <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 min-h-[80px]" placeholder="(Optional) Describe the category..." />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="color" className="text-right">Color</Label>
                      <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="col-span-3 h-10 p-1" />
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveCategory}>Save Category</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!categoryToDelete} onOpenChange={setCategoryToDelete}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the "{categoryToDelete?.name}" category.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCategory}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
