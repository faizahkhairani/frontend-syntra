import { Outlet, useNavigate } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SiteHeader } from "@/components/sidebar/site-header"
import { useAuthStore } from "@/store/authStore"
export default function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <TooltipProvider> 
    <SidebarProvider>
      <AppSidebar />
       <SidebarInset>
        <SiteHeader user={user} onLogout={handleLogout} />
        <div className="flex-1 min-h-0 overflow-auto p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  )
}

