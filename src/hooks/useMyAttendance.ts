import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface AttendanceRecord {
  _id: string
  shiftScheduleId: {
    shiftId: {
      name: string
      start_time: string
      end_time: string
    }
  }
  date: string
  checkIn: { time: string } | null
  checkOut: { time: string } | null
  status: "present" | "late" | "absent"
  workDuration: number
}

interface Pagination {
    total: number,
    page: number,
    limit: number,
    totalPages: number
}

export const useMyAttendance = () => {
    const [data, setData] = useState<AttendanceRecord[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [pagination, setPagination] = useState<Pagination>({
    total: 0, page: 1, limit: 10, totalPages: 0
  })
    const [filterMonth, setFilterMonth] = useState(
        String(new Date().getMonth() + 1).padStart(2, "0")
    )
    const [filterYear, setFilterYear] = useState(
        String(new Date().getFullYear())
    )

    const fetchAttendance = async (page = 1) => {
        try {
            setIsLoading(true)
            const params = new URLSearchParams()

            // params.append("page", "1")
            params.append("page", String(page))
            // limit = 10
            params.append("limit", "10")

            // filterMonth = "5" filterYear = "2026"
            if (filterMonth && filterYear) {
                params.append("month", filterMonth)
                params.append("year", filterYear)
            }

            // page=1&limit=10&month=5&year=2026
            const res = await api.get(`/attendance/my-attendance?${params.toString()}`)
            setData(res.data.data)
            setPagination(res.data.pagination)
            // console.log(res.data.pagination)
        } catch (error: any) {
            toast.error("Gagal mengambil data absensi")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
      fetchAttendance(1) // kalo ada query ulang dari page 1 
    }, [filterMonth, filterYear])
    
    return {
        data,
        isLoading,
        pagination,
        filterMonth,
        filterYear,
        setFilterMonth,
        setFilterYear,
        fetchAttendance
    }
}