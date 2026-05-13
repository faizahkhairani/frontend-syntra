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
        <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
                {/* Search nama */}
                <div className="relative w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Cari nama staff..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9"
                    />
                </div>

                {/* Filter tanggal */}
                <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => {
                    setFilterDate(e.target.value)
                    setFilterMonth("")
                    setFilterYear("")
                    }}
                    className="h-9 w-40"
                />

                {/* Filter bulan */}
                <Input
                    type="month"
                    value={filterMonth && filterYear ? `${filterYear}-${filterMonth}` : ""}
                    onChange={(e) => {
                    if (!e.target.value) return
                    // ["2025", "03"]
                    const [year, month] = e.target.value.split("-")
                    // setFilterMonth(03)
                    setFilterMonth(month)
                    setFilterYear(year)
                    setFilterDate("")
                    }}
                    className="h-9 w-40"
                />

                {/* Filter status */}
                <Select
                    value={filterStatus || "all"}
                    onValueChange={(val) => setFilterStatus(val === "all" ? "" : val)}
                >
                    <SelectTrigger className="h-9 w-36">
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
                    className="h-9 gap-1.5"
                    onClick={() => exportAttendancePDF(attendance, filterMonth, filterYear)}
                    >
                    <FileDown className="h-4 w-4" />
                    Export PDF
                    </Button>
                )}

                {/* Reset */}
                <Button
                variant="outline" size="sm"
                className="h-9 text-xs text-black"
                onClick={handleReset}
                >
                Reset filter
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