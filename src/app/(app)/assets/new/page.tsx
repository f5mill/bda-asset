
import Link from "next/link"
import {
  ChevronLeft,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories, locations } from "@/lib/data"


export default function NewAssetPage() {
  return (
    <div className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Link href="/">
            <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
            </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          Register New Asset
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Link href="/">
            <Button variant="outline" size="sm">
                Discard
            </Button>
          </Link>
          <Button size="sm">Save Asset</Button>
        </div>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
            <CardDescription>
              Fill in the information for the new asset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  className="w-full"
                  placeholder="e.g. MacBook Pro 16&quot;"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the asset..."
                  className="min-h-32"
                />
              </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category" aria-label="Select category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger id="location" aria-label="Select location">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                       {locations.map(location => (
                        <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                      ))}
                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="e.g. laptop, finance, high-value" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asset Image</CardTitle>
            <CardDescription>
              Upload a picture of the asset.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center w-full gap-4">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-card">
                    <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                            Image preview will appear here
                        </p>
                    </div>
                </div>
                <Button asChild variant="outline" className="w-full cursor-pointer">
                    <label htmlFor="file-upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm">Save Asset</Button>
      </div>
    </div>
  )
}
