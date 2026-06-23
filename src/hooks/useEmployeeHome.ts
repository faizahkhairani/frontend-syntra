import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface ShiftToday {
  _id: string
  shiftId: {
    name: string
    start_time: string
    end_time: string
    late_tolerance: number
    overnight: boolean
  }
  date: string
  attendanceStatus: {
    isCheckedIn: boolean
    isCheckedOut: boolean
    checkInTime: string | null
    checkOutTime: string | null
    status: string | null
  }
}

export const useEmployeeHome = () => {
  const [shiftToday, setShiftToday] = useState<ShiftToday[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAbsenLoading, setIsAbsenLoading] = useState<string | null>(null)

  const fetchTodaySchedule = async() => {
    try {
        setIsLoading(true)
        const res = await api.get("/shift-schedules/today")
        setShiftToday(res.data.data)
    } catch (error: any) {
        toast.error("Gagal mengambil jadwal hari ini")
    } finally {
        setIsLoading(false)
    }
  }

  const handleCheckIn = async(shiftScheduleId: string, position: GeolocationPosition) => {
    try {
        setIsAbsenLoading(shiftScheduleId)
        await api.post("/attendance/checkin", {
            shiftScheduleId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        toast.success("Absen Masuk Berhasil")
        fetchTodaySchedule() // refresh status
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Gagal absen masuk")
    } finally {
        setIsAbsenLoading(null)
    }
  }

  const handleCheckOut = async(shiftScheduleId: string, position: GeolocationPosition) => {
    try {
        setIsAbsenLoading(shiftScheduleId) // di panggil dari requestAbsen dan isinya shift._id
        await api.post("/attendance/checkout", {
            shiftScheduleId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        toast.success("Absen pulang Berhasil")
        fetchTodaySchedule() // refresh status
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Gagal absen keluar")
    } finally {
        setIsAbsenLoading(null)
    }
  }

  // minta izin lokasi lalu jalankan aksi
  const requestLocationAndAbsen = (
    shiftScheduleId: string, // id dari parent
    action: "checkin" | "checkout"
  ) => {
    if (!navigator.geolocation) {
      toast.error("Browser tidak mendukung GPS")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (action === "checkin") {
          handleCheckIn(shiftScheduleId, position) // panggil fungsi handleCheckIn
        } else {
          handleCheckOut(shiftScheduleId, position)
        }
      },
      () => {
        toast.error("Gagal mendapatkan lokasi — pastikan GPS aktif")
      }
    )
  }

  useEffect(() => {
    fetchTodaySchedule()
  }, [])

   return {
    shiftToday,
    isLoading,
    isAbsenLoading,
    requestLocationAndAbsen,
  }

}