import { Outlet, NavLink } from "react-router-dom"
import { Home, Calendar, ClipboardList, Palmtree } from "lucide-react"



const navItems = [
  { to: "/beranda",  label: "Home",     icon: Home },
  { to: "/jadwal",   label: "Jadwal",   icon: Calendar },
  { to: "/absensi", label: "Absensi",  icon: ClipboardList },
  { to: "/cuti",     label: "Cuti",     icon: Palmtree },
]

export default function EmployeeLayout() {
  // const user = useAuthStore((state) => state.user)

  // const initials = user?.name
  //   ?.split(" ")
  //   .map((n) => n[0])
  //   .join("")
  //   .toUpperCase()
  //   .slice(0, 2)

  //   const handleLogout = () => {
  //     useAuthStore.getState().logout()
  //   }

  return (
    <div className="min-h-screen bg-primary/2 flex flex-col">

      {/* Header */}
      {/* <header className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-poppins">
            {initials}
          </AvatarFallback>
        </Avatar>
            <div>
                <p className="text-xs text-muted-foreground">Selamat Datang</p>
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            </div>
        </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors bg-white rounded-full w-10 h-10"
          >
            <LogOut className="h-4 w-4" />
          </button>
      </header> */}

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