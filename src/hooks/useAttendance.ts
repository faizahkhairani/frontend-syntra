import { useState, useEffect } from "react"
import api from "@/lib/axios"
import type { Attendance } from "@/types"
import { toast } from "sonner"

export const useAttendance = (initialDate?: string) => {
  const today = new Date().toISOString().split("T")[0]

  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterDate, setFilterDate] = useState(initialDate ?? today) // ← default hari ini
  const [filterMonth, setFilterMonth] = useState("")
  const [filterYear, setFilterYear] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const fetchAttendance = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
      // knp if else karna filter pilih salah satu mau date atau bulanan dan tahunan
      // ?date=2026-05-09
      if (filterDate) {
      params.append("date", filterDate)
    } else if (filterMonth && filterYear) {
      // ?month=5&year=2026
      params.append("month", filterMonth)
      params.append("year", filterYear)
    }

    // ?date=2026-05-09&status=late <- kalo status ada
    if (filterStatus) params.append("status", filterStatus)

    // date=2026-05-09&status=present
    const res = await api.get(`/attendance?${params.toString()}`)
      setAttendance(res.data.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengambil data")
    } finally {
      setIsLoading(false)
    }
      
  }
  useEffect(() => {
    fetchAttendance()
  }, [filterDate, filterMonth, filterYear, filterStatus])

  return {
    attendance,
    isLoading,
    filterDate,
    filterMonth,
    filterYear,
    filterStatus,
    setFilterDate,
    setFilterMonth,
    setFilterYear,
    setFilterStatus,
    refetch: fetchAttendance,
  }
}