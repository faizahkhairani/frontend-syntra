import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface ScheduleRecord {
  _id: string
  shiftId: {
    name: string
    start_time: string
    end_time: string
  }
  date: string
}

interface Pagination {
    total: number,
    page: number,
    limit: number,
    totalPages: number
}

export const useMySchedule = () => {
    const [data, setData] = useState<ScheduleRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [pagination, setPagination] = useState<Pagination>({
    total: 0, page: 1, limit: 5, totalPages: 0
  })
    const [filterMonth, setFilterMonth] = useState(
        String(new Date().getMonth() + 1).padStart(2, "0")
    ) // ambil bulan sekarang
    const [filterYear, setFilterYear] = useState(
        String(new Date().getFullYear())
    ) // ambil tahun sekarang


    const fetchSchedule = async (page = 1) => {
        try {
            setIsLoading(true)
            const params = new URLSearchParams()
            // params.append("page", "1")
            params.append("page", String(page))
            // limit = 5
            params.append("limit", "5")
            if (filterMonth) params.set("month", filterMonth)
            if (filterYear) params.set("year", filterYear)

            const response = await api.get(`/shift-schedules/my-schedule?${params.toString()}`)
            setData(response.data.data)
            setPagination(response.data.pagination)
        } catch (error) {
            toast.error("Gagal mengambil data jadwal")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSchedule(1) // kalo ada query ulang dari page 1
    }, [filterMonth, filterYear])

    return {
        data,
        isLoading,
        pagination,
        filterMonth,
        filterYear,
        setFilterMonth,
        setFilterYear,
        fetchSchedule,
    }
}