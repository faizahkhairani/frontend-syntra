import { Briefcase, Clock, Inbox, MessageCircleWarning } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { useEmployeeHome } from "@/hooks/useEmployeeHome"
import ShiftCard from "@/components/employee/shift-card"
import { useAuthStore } from "@/store/authStore"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"


const MyDashboard = () => {
  const user = useAuthStore((state) => state.user)

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = () => {
    useAuthStore.getState().logout()
  }
  const { shiftToday, isAbsenLoading, isLoading, requestLocationAndAbsen } = useEmployeeHome()

  const currentDate = format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })
  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });


  return (
    <div className="-mx-4 -mt-4">
      <div className="bg-primary rounded-b-[2.5rem] px-6 pt-6 pb-10">
        <header className="flex items-start justify-between space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-13 w-13">
              <AvatarFallback className="bg-white text-primary text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-blue-100 text-xs">Selamat Datang</p>
              <p className="text-white text-xl font-semibold">{user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors bg-white/20 rounded-full w-10 h-10"
          >
            <LogOut className="h-4 w-4 text-white" />
          </button>
        </header>
        {/* Tanggal hari ini */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">
                Waktu Sekarang
              </p>
              <p className="text-white text-3xl font-semibold">
                {currentTime}
              </p>
            </div>
            <Clock className="w-12 h-12 text-white/80" />
          </div>
          <p className="text-blue-100 text-xs mt-2">
            {currentDate}
          </p>
        </div>
      </div>
      <div className="px-6 -mt-4">
        <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-gray-900 font-semibold mb-1">
                Pengingat
              </h4>
              <p className="text-gray-600 text-sm">
                Jangan lupa absen hari ini
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : shiftToday.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-slate-700">
              Tidak ada jadwal hari ini
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hubungi admin jika ada kesalahan jadwal
            </p>
          </div>
        ) : (
          <div className="bg-primary rounded-2xl p-5 shadow-lg mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">
                Shift Hari Ini
              </h3>
              <span className="ml-auto bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white font-medium">
                {shiftToday.length} Shift
              </span>
            </div>
            <div className="space-y-3">
            {shiftToday.map((shift) => (
              <ShiftCard
                key={shift._id}
                shift={shift}
                isLoading={isAbsenLoading === shift._id} // isinya true / false
                // ShiftCard panggil prop onCheckIn yang dia terima dari parent, sambil kirim shift._id sebagai argumen.
                onCheckIn={(id) => requestLocationAndAbsen(id, "checkin")} // id = shift.id, lalu jalankan fungsi requestlocation
                onCheckOut={(id) => requestLocationAndAbsen(id, "checkout")}
              />
            ))}

            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyDashboard