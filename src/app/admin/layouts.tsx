import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
// import { useAuthStore } from "@/store/authStore"
export default function AdminLayout() {
  // const {user} = useAuthStore()
  return (
    <TooltipProvider> 
    <SidebarProvider>
      <AppSidebar />
       <SidebarInset>
        <header className="flex h-16 bg-white items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-8" />
            </div>
            {/* Greeting di header */}
            {/* <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{user?.name}</span>
            </div> */}
          </header>
        <div className="flex-1 min-h-0 overflow-auto p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  )
}

