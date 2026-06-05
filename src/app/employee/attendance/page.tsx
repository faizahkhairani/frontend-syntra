import { useMyAttendance } from "@/hooks/useMyAttendance"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import MobilePagination from "@/components/employee/mobile-pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"



const statusConfig = {
  present: { label: "Hadir", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  late:    { label: "Telat", className: "bg-amber-50 text-amber-700 border-amber-200" },
}

const MyAttendance = () => {
  const {
    data, 
    isLoading, 
    pagination, 
    filterMonth, 
    filterYear, 
    setFilterMonth, 
    setFilterYear, 
    fetchAttendance
  } = useMyAttendance()

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


    // const present = data.filter((a) => a.status === "present").length
    // const late = data.filter((a) => a.status === "late").length
  return (
    <div className="-mt-4 -mx-4">
      <div className="bg-liner-to-br bg-primary rounded-b-[2.5rem] px-6 pt-6 pb-6 shadow-xl">
        {/* Tahun */}
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Filter By</h2>
            {/* <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg border-none outline-none"
            >
            {[2024, 2025, 2026].map((y) => (
                <option key={y} value={String(y)} className="text-black">
                {y}
                </option>
            ))}
            </select> */}
            <Select onValueChange={(value) => setFilterYear(value)} defaultValue={filterYear}>
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Filter Tahun" />
              </SelectTrigger>
              <SelectContent>
                  {[2024, 2025, 2026].map((y) => (
                      <SelectItem key={y} value={String(y)}>
                          {y}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>
        </div>

        {/* Grid bulan */}
        <div className="grid grid-cols-3 gap-2">
          {months.map((m) => (
          <Button
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
          </Button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="text-gray-900 font-semibold">Riwayat Absensi</h3>
      </div>
        {/* Filter bulan */}
        

      <div className="space-y-3">
        {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
                Tidak ada data absensi bulan ini
            </div>
        ) : (
            data.map((d) => {
                const status = statusConfig[d.status as keyof typeof statusConfig]
                const shift = d.shiftScheduleId?.shiftId // ambil shift dari shift schedule
            return(
                <div
                key={d._id}
                className="bg-white rounded-xl border p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {shift?.name ?? "-"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {d.date}
                    </p>
                  </div>
                  {status
                    ? <Badge variant="outline" className={status.className}>{status.label}</Badge>
                    : <span className="text-muted-foreground text-sm">-</span>
                  }
                </div>

                {/* Detail */}
                <div className="grid grid-cols-3 gap-2 bg-muted/30 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Masuk</p>
                    <p className="text-sm font-medium">
                      {d.checkIn?.time ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pulang</p>
                    <p className="text-sm font-medium">
                      {d.checkOut?.time ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Durasi</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      {d.workDuration
                        ? `${Math.floor(d.workDuration / 60)}h ${d.workDuration % 60}m`
                        : "-"
                      }
                    </p>
                  </div>
                </div>

                {/* Jam shift */}
                {shift && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{shift.start_time} - {shift.end_time}</span>
                  </div>
                )}
              </div>
            )
            })
        )}
        <MobilePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        // fetchAttendance 2
        onPageChange={fetchAttendance}
        />
      </div>

      </div>
    </div>
  )
}

export default MyAttendance