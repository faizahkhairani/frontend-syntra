import { useState, useEffect } from "react"
import api from "@/lib/axios"
import type { ShiftSchedule } from "@/types"

export const useUsersSchedules = () => {
    const [userSchedules, setUserSchedules] = useState<ShiftSchedule[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<String | null>(null)


    const fetchUserSchedules = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/shift-schedules")
            setUserSchedules(res.data.data)
        } catch (error: any) {
            setError(error.response?.data?.message || "Gagal mengambil data")
        } finally {
            setIsLoading(false)
        }
    }

    const deleteUserSchedules = async (id: string) => {
        try {
            await api.delete(`/shift-schedules/${id}`)
            setUserSchedules((prev) => prev.filter((u) => u._id !== id))
        } catch (err: any) {
            throw new Error(err.response?.data?.message || "Gagal menghapus data")
        }
    }

    useEffect(() => {
      fetchUserSchedules()
    }, [])
    

    return {userSchedules, isLoading, error, deleteUserSchedules, fetchUserSchedules}

}