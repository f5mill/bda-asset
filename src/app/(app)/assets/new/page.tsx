import Link from "next/link"
import {
  ChevronLeft,
  PlusCircle,
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
