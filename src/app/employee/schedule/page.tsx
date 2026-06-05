import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarDays, Sunrise, Sun, Moon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useMySchedule } from "@/hooks/useMySchedule"
import MobilePagination from "@/components/employee/mobile-pagination"


const getShiftConfig = (shiftName: string) => {
  const name = shiftName.toLowerCase()
  if (name.includes("pagi")) return {
    icon: Sunrise,
    iconBg: "bg-orange-400",
    badge: "bg-orange-400 text-white",
    label: "Pagi",
    cardBg: "bg-orange-50",
  }
  if (name.includes("siang") || name.includes("sore")) return {
    icon: Sun,
    iconBg: "bg-blue-500",
    badge: "bg-blue-500 text-white",
    label: name.includes("siang") ? "Siang" : "Sore",
    cardBg: "bg-blue-50",
  }
  if (name.includes("malam")) return {
    icon: Moon,
    iconBg: "bg-purple-500",
    badge: "bg-purple-500 text-white",
    label: "Malam",
    cardBg: "bg-purple-50",
  }
  return {
    icon: CalendarDays,
    iconBg: "bg-gray-400",
    badge: "bg-gray-400 text-white",
    label: shiftName,
    cardBg: "bg-gray-50",
  }
}

const MySchedule = () => {
    const {
        data, 
        isLoading, 
        pagination,
        filterMonth,
        filterYear,
        setFilterMonth,
        setFilterYear,
        fetchSchedule
  } = useMySchedule()

  const months = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
]

  const today = new Date().toISOString().split("T")[0]
  return (
    <div className="-mx-4 -mt-4">
        <div className="bg-liner-to-br bg-primary rounded-b-[2.5rem] px-6 pt-6 pb-6 shadow-xl">
            {/* Tahun */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg font-semibold">Filter By</h2>
                <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg border-none outline-none"
                >
                {[2024, 2025, 2026].map((y) => (
                    <option key={y} value={String(y)} className="text-black">
                    {y}
                    </option>
                ))}
                </select>
            </div>

            {/* Grid bulan */}
            <div className="grid grid-cols-3 gap-2">
                {months.map((m) => (
                <button
                    key={m.value}
                    onClick={() => setFilterMonth(m.value)}
                    className={`
                    py-2 rounded-xl text-sm font-medium transition-all
                    ${filterMonth === m.value
                        ? "bg-white text-primary"           // ← dipilih
                        : "bg-white/15 text-white/80 hover:bg-white/25"  // ← tidak dipilih
                    }
                    `}
                >
                    {m.label}
                </button>
                ))}
            </div>
        </div>
        <div className="px-6 mt-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-slate-600" />
                    <h1 className="text-base font-semibold text-slate-800">
                        Jadwal Bulan Ini
                    </h1>
                </div>
            </div>
            <div className="space-y-2">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                    ))
                ) : (
                    data.map((d) => {
                        const shift = d.shiftId
                        const config = getShiftConfig(shift.name)
                        const Icon = config.icon
                        const isScheduleToday = d.date === today
                        return(
                            <div className={`
                            rounded-2xl p-4 flex items-center justify-between
                            border transition-all
                            ${isScheduleToday
                                ? "border-blue-400 bg-orange-50 shadow-sm"
                                : `${config.cardBg} border-transparent`
                            }
                            `}
                            >
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex items-center gap-3">
                                        {/* Icon */}
                                        <div className={`w-11 h-11 rounded-2xl ${config.iconBg} flex items-center justify-center shadow-sm`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        {/* info */}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-800">
                                                {format(parseISO(d.date), "EEEE, dd MMM", { locale: id })}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {shift.start_time} - {shift.end_time}
                                            </p>
                                        </div>
                                        {/* Badge shift */}
                                        <span className={`ml-auto text-xs font-medium px-3 py-1.5 rounded-full ${config.badge}`}>
                                        {config.label}
                                        </span>
                                    </div>
                                    {isScheduleToday && (
                                    <p className="text-xs text-blue-500 font-medium mt-0.5">
                                        Shift Hari Ini
                                    </p>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
                <MobilePagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                // fetchSchedule 2
                onPageChange={fetchSchedule}
                />
            </div>

        </div>
    </div>
  )
}

export default MySchedule