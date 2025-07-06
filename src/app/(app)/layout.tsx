"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutGrid,
    QrCode,
    Bell,
    Settings,
    Tags,
    MapPin,
    CalendarDays,
    AlarmClock,
    LayoutList,
    Users,
} from "lucide-react"

import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarInset,
    SidebarTrigger,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const getPageTitle = (path: string) => {
        if (path === '/') return 'Dashboard'
        if (path === '/scan') return 'Scan QR Code'
        if (path.startsWith('/team')) return 'Users'
        if (path === '/bookings') return 'Bookings'
        if (path === '/reminders') return 'Reminders'
        if (path === '/categories') return 'Categories'
        if (path === '/tags') return 'Tags'
        if (path === '/locations') return 'Locations'
        if (path.startsWith('/settings')) return 'Settings'
        if (path.startsWith('/assets/new')) return 'Register New Asset'
        if (path.startsWith('/assets/')) return 'Asset Details'
        return 'Dashboard'
    }

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <Logo />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                href="/"
                                isActive={pathname === '/'}
                                tooltip="Dashboard"
                            >
                                <LayoutGrid />
                                Dashboard
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/scan" isActive={pathname.startsWith('/scan')} tooltip="Scan QR Code">
                                <QrCode />
                                Scan QR Code
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        
                        <SidebarSeparator className="my-2" />

                        <SidebarMenuItem>
                            <SidebarMenuButton href="/team/users" isActive={pathname.startsWith('/team')} tooltip="Users">
                                <Users />
                                Users
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarSeparator className="my-2" />

                        <SidebarMenuItem>
                            <SidebarMenuButton href="/bookings" isActive={pathname.startsWith('/bookings')} tooltip="Bookings">
                                <CalendarDays />
                                Bookings
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/reminders" isActive={pathname.startsWith('/reminders')} tooltip="Reminders">
                                <AlarmClock />
                                Reminders
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarSeparator className="my-2" />

                        <SidebarMenuItem>
                            <SidebarMenuButton href="/categories" isActive={pathname.startsWith('/categories')} tooltip="Categories">
                                <LayoutList />
                                Categories
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/tags" isActive={pathname.startsWith('/tags')} tooltip="Tags">
                                <Tags />
                                Tags
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/locations" isActive={pathname.startsWith('/locations')} tooltip="Locations">
                                <MapPin />
                                Locations
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <div className="flex items-center gap-3">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="person" />
                                        <AvatarFallback>AU</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-2 text-left group-data-[collapsible=icon]:hidden">
                                        <p className="font-medium text-sm">Admin User</p>
                                        <p className="text-xs text-muted-foreground">admin@assethound.com</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Admin User</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                    admin@assethound.com
                                    </p>
                                </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <SidebarSeparator />
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                         <SidebarTrigger />
                         <h1 className="text-lg font-semibold font-headline">{getPageTitle(pathname)}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <ThemeToggle />
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
