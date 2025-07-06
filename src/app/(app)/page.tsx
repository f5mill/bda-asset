
"use client"

import * as React from "react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  Label,
  Cell,
  XAxis
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { assets } from "@/lib/data"
import type { AssetStatus } from "@/lib/types"
import { getBadgeVariant } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

const totalInventoryChartData = [
  { date: "AUG", total: 0 },
  { date: "SEP", total: 0 },
  { date: "OCT", total: 1 },
  { date: "NOV", total: 2 },
  { date: "DEC", total: 3 },
  { date: "JAN", total: 5 },
]

const totalInventoryChartConfig = {
  total: {
    label: "Total assets",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig


export default function Dashboard() {
  const totalAssets = assets.length
  
  const statusCounts = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1
    return acc
  }, {} as Record<AssetStatus, number>)

  const assetsByStatusData = [
      { status: 'Available', count: statusCounts['Available'] || 0, fill: 'hsl(var(--chart-1))' },
      { status: 'Checked Out', count: statusCounts['Checked Out'] || 0, fill: 'hsl(var(--chart-2))' },
      { status: 'In Repair', count: statusCounts['In Repair'] || 0, fill: 'hsl(var(--chart-3))' },
      { status: 'Booked', count: statusCounts['Booked'] || 0, fill: 'hsl(var(--chart-4))' },
  ].filter(d => d.count > 0)


  const assetsByCategoryData = [{ category: "Uncategorized", count: totalAssets, fill: "hsl(var(--chart-2))" }]

  const mostRecentlyScanned = [...assets]
    .sort((a, b) => new Date(b.lastScan).getTime() - new Date(a.lastScan).getTime())
    .slice(0, 3)

  const leastRecentlyScanned = [...assets]
    .sort((a, b) => new Date(a.lastScan).getTime() - new Date(b.lastScan).getTime())
    .slice(0, 3)

  const PlaceholderCard = ({ title }: { title: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No data to display
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <div className="grid gap-4 lg:col-span-2 xl:col-span-4">
            <Card>
                <CardHeader>
                    <CardTitle>Total Inventory</CardTitle>
                    <CardDescription>{totalAssets} assets</CardDescription>
                </CardHeader>
                <CardContent className="h-60">
                    <ChartContainer config={totalInventoryChartConfig} className="h-full w-full">
                    <AreaChart
                        data={totalInventoryChartData}
                        margin={{ left: 0, right: 24, top: 5, bottom: 0 }}
                    >
                        <defs>
                        <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
                        </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
                        <Area
                            dataKey="total"
                            type="monotone"
                            fill="url(#fillTotal)"
                            stroke="var(--color-total)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

        <div className="grid auto-rows-max gap-4 xl:col-span-2">
            <PlaceholderCard title="Inventory Value" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Assets by status</CardTitle>
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                    <div className="relative h-40 w-40">
                        <PieChart width={160} height={160}>
                            <Pie
                                data={assetsByStatusData}
                                cx={80}
                                cy={80}
                                innerRadius={60}
                                outerRadius={80}
                                dataKey="count"
                                strokeWidth={0}
                            >
                                {assetsByStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">
                                                {totalAssets}
                                            </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full space-y-2 text-sm">
                        {assetsByStatusData.map(item => (
                            <div key={item.status} className="flex items-center">
                                <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: item.fill }} />
                                <span className="text-muted-foreground">{item.count} {item.status}</span>
                            </div>
                        ))}
                    </div>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Most recently scanned</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                        {mostRecentlyScanned.map(asset => (
                            <TableRow key={asset.id}>
                                <TableCell>
                                    <Link href={`/assets/${asset.id}`} className="font-medium hover:underline">{asset.name}</Link>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={getBadgeVariant(asset.status) as any} className="font-normal">{asset.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Least recently scanned</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                        {leastRecentlyScanned.map(asset => (
                            <TableRow key={asset.id}>
                                <TableCell>
                                    <Link href={`/assets/${asset.id}`} className="font-medium hover:underline">{asset.name}</Link>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={getBadgeVariant(asset.status) as any} className="font-normal">{asset.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <div className="grid auto-rows-max gap-4 xl:col-span-2">
            <PlaceholderCard title="Location value" />
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Assets by category</CardTitle>
                    <Link href="/categories"><Button variant="link" size="sm" className="h-auto p-0">See all</Button></Link>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                    <div className="relative h-40 w-40">
                         <PieChart width={160} height={160}>
                            <Pie
                                data={assetsByCategoryData}
                                cx={80}
                                cy={80}
                                innerRadius={60}
                                outerRadius={80}
                                dataKey="count"
                                strokeWidth={0}
                            >
                                {assetsByCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">
                                                {totalAssets}
                                            </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full space-y-2 text-sm">
                        <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: assetsByCategoryData[0].fill }} />
                            <span className="text-muted-foreground">{assetsByCategoryData[0].count} {assetsByCategoryData[0].category}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <PlaceholderCard title="Top custodians" />
            <PlaceholderCard title="Top locations" />
        </div>
    </div>
  )
}
