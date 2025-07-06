
"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { assets } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

const bookingFormSchema = z.object({
  purpose: z.string().min(1, "Purpose is required."),
  assetIds: z.array(z.string()).nonempty({ message: "At least one asset must be selected." }),
  bookedBy: z.string().min(1, "Custodian name is required."),
  dateRange: z.object({
    from: z.date({ required_error: "A start date is required."}),
    to: z.date({ required_error: "An end date is required."}),
  }),
  notes: z.string().optional(),
}).refine(data => data.dateRange.to >= data.dateRange.from, {
  message: "End date cannot be earlier than start date.",
  path: ["dateRange"],
});


type BookingFormValues = z.infer<typeof bookingFormSchema>

export default function NewBookingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const [openAssetSelector, setOpenAssetSelector] = useState(false)

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            purpose: "",
            assetIds: [],
            bookedBy: "",
            notes: "",
        },
    })
    
    useEffect(() => {
        const assetId = searchParams.get('assetId');
        if (assetId) {
            form.setValue('assetIds', [assetId]);
        }
    }, [searchParams, form]);
    
    function onSubmit(data: BookingFormValues) {
        console.log("New Booking Data:", data)
        toast({
            title: "Booking Created",
            description: "The new booking has been successfully created.",
        })
        router.push("/bookings")
    }

    const selectedAssets = assets.filter(asset => form.watch("assetIds").includes(asset.id))
    const bookableAssets = assets.filter(asset => asset.isBookable ?? true);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/bookings">
                        <Button variant="outline" size="icon" className="h-7 w-7">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                    </Link>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
                        Create New Booking
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button variant="outline" size="sm" type="button" onClick={() => router.push('/bookings')}>
                            Discard
                        </Button>
                        <Button size="sm" type="submit">Save Booking</Button>
                    </div>
                </div>
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Details</CardTitle>
                            <CardDescription>
                                Fill in the information for the new booking.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="purpose"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name / Purpose</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Q4 Marketing Campaign Shoot" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                  control={form.control}
                                  name="assetIds"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Assets</FormLabel>
                                      <Popover open={openAssetSelector} onOpenChange={setOpenAssetSelector}>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value?.length && "text-muted-foreground")}>
                                              {selectedAssets.length > 0 
                                                ? `${selectedAssets.length} asset(s) selected`
                                                : "Select assets to book"}
                                            </Button>
                                          </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <ScrollArea className="h-72">
                                              <div className="p-4 space-y-4">
                                                {bookableAssets.map((asset) => (
                                                  <FormField
                                                    key={asset.id}
                                                    control={form.control}
                                                    name="assetIds"
                                                    render={({ field }) => (
                                                      <FormItem key={asset.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                          <Checkbox
                                                            checked={field.value?.includes(asset.id)}
                                                            onCheckedChange={(checked) => {
                                                              return checked
                                                                ? field.onChange([...(field.value || []), asset.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                      (value) => value !== asset.id
                                                                    )
                                                                  )
                                                            }}
                                                          />
                                                        </FormControl>
                                                        <FormLabel className="font-normal flex flex-col cursor-pointer">
                                                            {asset.name}
                                                            <span className="text-xs text-muted-foreground">Status: {asset.status}</span>
                                                        </FormLabel>
                                                      </FormItem>
                                                    )}
                                                  />
                                                ))}
                                              </div>
                                            </ScrollArea>
                                        </PopoverContent>
                                      </Popover>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="dateRange"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Booking Dates</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
                                                                    !field.value?.from && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field.value?.from ? (
                                                                    field.value?.to ? (
                                                                        `${format(field.value.from, "LLL dd, y")} - ${format(field.value.to, "LLL dd, y")}`
                                                                    ) : (
                                                                        format(field.value.from, "LLL dd, y")
                                                                    )
                                                                ) : (
                                                                    <span>Pick a date range</span>
                                                                )}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            initialFocus
                                                            mode="range"
                                                            defaultMonth={field.value?.from}
                                                            selected={field.value as DateRange}
                                                            onSelect={field.onChange}
                                                            numberOfMonths={1}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bookedBy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Custodian / Booked By</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. John Doe or Marketing Team" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description / Notes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Provide any additional details about the booking..."
                                                    className="min-h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="flex items-center justify-center gap-2 md:hidden">
                    <Button variant="outline" size="sm" type="button" onClick={() => router.push('/bookings')}>
                        Discard
                    </Button>
                    <Button size="sm" type="submit">Save Booking</Button>
                </div>
            </form>
        </Form>
    )
}
