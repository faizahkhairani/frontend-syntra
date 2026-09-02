import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Search,
  Bell,
  LogOut, User2, ChevronsUpDown
} from "lucide-react"
import { useLocation } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types"

interface SiteHeaderProps {
  user: User | null
  onLogout: () => void
}

// Mapping route ke judul halaman
const getPageTitle = (pathname: string): string => {
  const titleMap: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/users": "Karyawan",
    "/admin/shifts": "Jadwal Kerja",
    "/admin/schedules": "Jadwal Karyawan",
    "/admin/leaves": "Cuti",
    "/admin/saw": "Saw",
    "/admin/attendances": "Absensi",
    "/employee/dashboard": "Dashboard",
    "/employee/attendance": "Absensi",
    "/employee/schedule": "Jadwal",
    "/employee/leave": "Cuti",
  }

  // Cari path yang match
  for (const [route, title] of Object.entries(titleMap)) {
    if (pathname.startsWith(route)) {
      return title
    }
  }

  return "Dashboard"
}

export function SiteHeader({user, onLogout}: SiteHeaderProps) {
    const location = useLocation()
    const pageTitle = getPageTitle(location.pathname)
    
    // ambil inisial nama untuk avatar
    const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  return (
    <header className="flex h-16 bg-white items-center justify-between gap-2">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative"
          >
            <Bell className="h-5 w-5" />

            {/* Notification badge */}
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />

            <span className="sr-only">Notifications</span>
          </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <div className="ml-5 flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:mx-auto">
                    <AvatarFallback className="rounded-full bg-primary text-white text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="font-medium truncate">{user?.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown size="17" />

                </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56">
                    <DropdownMenuLabel>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground capitalize truncate">
                        {user?.email}
                        </span>
                    </div>
                    </DropdownMenuLabel>
                     <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                        <User2 className="mr-2 h-4 w-4" />
                            Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={onLogout}
                        className="cursor-pointer text-red-500 focus:text-red-500"
                    >
                    <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
