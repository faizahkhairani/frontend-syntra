import { Outlet, NavLink } from "react-router-dom"
import { Home, Calendar, ClipboardList, Palmtree } from "lucide-react"



const navItems = [
  { to: "/beranda",  label: "Home",     icon: Home },
  { to: "/jadwal",   label: "Jadwal",   icon: Calendar },
  { to: "/absensi", label: "Absensi",  icon: ClipboardList },
  { to: "/cuti",     label: "Cuti",     icon: Palmtree },
]

export default function EmployeeLayout() {
 

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Content */}
      <main className="flex-1 overflow-auto pb-20">
        <div className="max-w-md mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white">
        <div className="max-w-md mx-auto flex items-center justify-around h-16">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  )
}