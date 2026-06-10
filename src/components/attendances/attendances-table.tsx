import { useState } from "react"
import { DataTable } from "./table/table"
import { getColumn } from "./table/column"
import { exportAttendancePDF } from "@/lib/pdf"
import { Input } from "../ui/input"
import { Search } from "lucide-react"

import { useAttendance } from "@/hooks/useAttendance"
import {AttendanceFilter} from "./attendances-filter"


const AttendancesTable = () => {
    const {
    attendance, isLoading, applyFilter, resetFilter, filter
    
  } = useAttendance()
    const [search, setSearch] = useState("")

    const filtered = attendance.filter((u) =>
        u.userId.name.toLowerCase().includes(search.toLowerCase())
    )


    const columns = getColumn()
  return (
    <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="relative flex-1 min-w-36">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                placeholder="Cari nama karyawan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm bg-gray-50 border-gray-200"
                />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <AttendanceFilter
                currentFilter={filter} // tampilkan nilai filter saat ini
                onApply={applyFilter} // kalu user klik "Terapkan", panggil applyFilter dari hook
                onReset={resetFilter} // kalau user klik "Reset", panggil resetFilter dari hook
                onExportPDF={() =>  exportAttendancePDF(attendance, filter.month!, filter.year!)}
                />
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