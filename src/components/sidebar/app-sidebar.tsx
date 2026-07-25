import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import NavUser from "./nav-user";

import NavMain from "./nav-main";

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
  ],
  
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const {user} = useAuthStore()
  // const navItems = user?.role === "admin" ? navAdmin : navEmployee;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="mt-2 flex h-10 items-center gap-2">
          <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <span className="truncate text-2xl font-medium">SyncTra</span>
        </div>
      </SidebarHeader>
      <hr className="border-background" />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}