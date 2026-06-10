import { useState, useEffect, useCallback } from "react"
import api from "@/lib/axios"
import type { Attendance } from "@/types"
import { format } from "date-fns";
import { toast } from "sonner"

export type AttendanceStatus = "present" | "late" | "";
export type FilterMode = "today" | "month";



export interface AttendanceFilter {
  mode: FilterMode;
  date?: string;   // "YYYY-MM-DD" — dipakai saat mode = today
  month?: string;  // "1"-"12"    — dipakai saat mode = month
  year?: string;   // "2026"
  status?: AttendanceStatus;
}


const todayFilter = (): AttendanceFilter => ({
  mode: "today",
  date: format(new Date(), "yyyy-MM-dd"),
});

export function useAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [filter, setFilter] = useState<AttendanceFilter>(todayFilter);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAttendance = useCallback(async (f: AttendanceFilter) => {
    setIsLoading(true)
    try {
      const params: Record<string, string> = {};
        if (f.mode === "today" && f.date) {
        params.date = f.date;
      } else if (f.mode === "month" && f.month && f.year) {
        params.month = f.month;
        params.year  = f.year;
      }

      if (f.status) params.status = f.status;
      const res = await api.get("/attendance", {params})
      setAttendance(res.data.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengambil data")
    } finally {
      setIsLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchAttendance(filter)
  }, [filter, fetchAttendance])

  return{
    attendance,
    filter,
    isLoading,
    applyFilter: (f: AttendanceFilter) => setFilter(f),
    resetFilter: () => setFilter(todayFilter()),
    refetch: () => fetchAttendance(filter),
  }
}