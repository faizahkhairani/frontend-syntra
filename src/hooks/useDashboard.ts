import { useState, useEffect } from "react"
import api from "@/lib/axios"
import type { DashboardSummary } from "@/types"


export const DUMMY_ATTENDANCE_DATA = [
  { day: "Sunday", hadir: 18, terlambat: 2, absen: 1 },
  { day: "Monday", hadir: 20, terlambat: 1, absen: 0 },
  { day: "Tuesday", hadir: 17, terlambat: 3, absen: 1 },
  { day: "Wednesday", hadir: 19, terlambat: 2, absen: 0 },
  { day: "Thursday", hadir: 15, terlambat: 4, absen: 2 },
  { day: "Friday", hadir: 20, terlambat: 0, absen: 1 },
  { day: "Saturday", hadir: 21, terlambat: 1, absen: 0 },
];

export const DUMMY_LEAVE_SUMMARY = {
  pending: 4,
  approved: 12,
  rejected: 2,
};


export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attendanceData, setAttendanceData] = useState(DUMMY_ATTENDANCE_DATA);
  const [leaveStatusData, setLeaveStatusData] = useState(DUMMY_LEAVE_SUMMARY)

  const fetchSummary = async () => {
    try {
      setIsLoading(true)
      const res = await api.get("/dashboard/summary")
      setSummary(res.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengambil data")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAttendanceWeekly = async () => {
    try {
      setIsLoading(true)
      // const res = await api.get("/dashboard/attendance-weekly")
      setAttendanceData(DUMMY_ATTENDANCE_DATA);
    } catch (error: any) {
      setError(error.response?.data?.message || "Gagal mengambil data")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLeaveSummary = async () => {
    try {
      setIsLoading(true)
      const res = await api.get("/dashboard/leave-summary")
      setLeaveStatusData(res.data)
    } catch (error: any) {
      setError(error.response?.data?.message || "Gagal mengambil data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary(),
    fetchAttendanceWeekly(),
    fetchLeaveSummary()
  }, [])

  return { summary, attendanceData, leaveStatusData, isLoading, error , fetchAttendanceWeekly, fetchLeaveSummary, refetch: fetchSummary }
}