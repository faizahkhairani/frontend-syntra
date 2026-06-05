import { useState } from "react"
import { DataTable } from "./table/table"
import { getColumn } from "./table/column"
import { exportAttendancePDF } from "@/lib/pdf"
import { FileDown } from "lucide-react" 

import { Input } from "../ui/input"
import { Search } from "lucide-react"
import { Button } from "../ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useAttendance } from "@/hooks/useAttendance"


const AttendancesTable = () => {
    const {
    attendance, isLoading,
    filterDate, filterMonth, filterYear, filterStatus,
    setFilterDate, setFilterMonth, setFilterYear, setFilterStatus,
  } = useAttendance()
    const [search, setSearch] = useState("")

    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"))
    const months = [
        { value: "01", label: "Januari" }, { value: "02", label: "Februari" },
        { value: "03", label: "Maret" }, { value: "04", label: "April" },
        { value: "05", label: "Mei" }, { value: "06", label: "Juni" },
        { value: "07", label: "Juli" }, { value: "08", label: "Agustus" },
        { value: "09", label: "September" }, { value: "10", label: "Oktober" },
        { value: "11", label: "November" }, { value: "12", label: "Desember" },
    ]
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 3 + i))



    const filtered = attendance.filter((u) =>
        u.userId.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleReset = () => {
        const today = new Date().toISOString().split("T")[0]
        setFilterDate(today)
        setFilterMonth("")
        setFilterYear("")
        setFilterStatus("")
        setSearch("")
    }

    // const isFiltered =
    // filterMonth || filterStatus || search ||
    // filterDate !== new Date().toISOString().split("T")[0]

    const columns = getColumn()
  return (
    <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-wrap items-end gap-4">
                  {/* Search */}
                  <div className="relative w-56">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                          placeholder="Cari nama staff..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="h-9 pl-9"
                      />
                  </div>
                  {/* Date Filter Group */}
                  <div className="flex items-end gap-2">
                      <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                              Tanggal
                          </span>
                          <Select value={filterDate} onValueChange={setFilterDate}>
                              <SelectTrigger className="w-20">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                  {days.map((d) => (
                                      <SelectItem key={d} value={d}>
                                          {d}
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                      <span className="pb-2 text-muted-foreground">/</span>
                      <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                              Bulan
                          </span>
                          <Select value={filterMonth} onValueChange={setFilterMonth}>
                              <SelectTrigger className="w-36">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                  {months.map((m) => (
                                      <SelectItem key={m.value} value={m.value}>
                                          {m.label}
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                      <span className="pb-2 text-muted-foreground">/</span>
                      <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                              Tahun
                          </span>
                          <Select value={filterYear} onValueChange={setFilterYear}>
                              <SelectTrigger className="w-24">
                                  <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                  {years.map((y) => (
                                      <SelectItem key={y} value={y}>
                                          {y}
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                  </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                    value={filterStatus || "all"}
                      onValueChange={(val) =>
                          setFilterStatus(val === "all" ? "" : val)
                      }
                >
                      <SelectTrigger className="h-9 w-40">
                          <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="present">Hadir</SelectItem>
                          <SelectItem value="late">Telat</SelectItem>
                    </SelectContent>
                </Select>

                {filterMonth && filterYear && (
                    <Button
                    variant="outline"
                    size="sm"
                          className="h-9 gap-2"
                          onClick={() =>
                              exportAttendancePDF(
                                  attendance,
                                  filterMonth,
                                  filterYear
                              )
                          }
                    >
                    <FileDown className="h-4 w-4" />
                    Export PDF
                    </Button>
                  )}
                <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                onClick={handleReset}
                >
                      Reset Filter
                  </Button>
            </div>
        </div>
        <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        />
    </div>
  )
}

export default AttendancesTable