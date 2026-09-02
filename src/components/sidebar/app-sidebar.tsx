import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Megaphone,
  Users,
  CalendarSync,
  CalendarDays,
  PawPrint,
  Scale
} from "lucide-react";

import NavMain from "./nav-main";
import NavSecondary from "./nav-secondary";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Karyawan",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Jadwal Kerja",
      url: "/admin/shifts",
      icon: CalendarDays
    },
    {
      title: "Jadwal Karyawan",
      url: "/admin/schedules",
      icon: CalendarDays,
    },
  ],
  navSecondary: [
    {
      title: "Cuti",
      url: "/admin/leaves",
      icon: CalendarSync,
    },
    {
      title: "Saw",
      url: "/admin/saw",
      icon: Scale,
    },
    {
      title: "Absensi",
      url: "/admin/attendances",
      icon: Megaphone,
    },
  ]
  
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="mt-2 flex h-10 items-center gap-2">
          <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <span className="truncate text-2xl font-bold">SyncTra</span>
        </div>
      </SidebarHeader>
      <hr className="border-background" />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary}/>
      </SidebarContent>
    </Sidebar>
  )
}