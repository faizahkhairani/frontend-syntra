import { useState, useEffect } from "react"
import api from "@/lib/axios"
import type { Shift } from "@/types"

export const useShifts = () => {
    const [shifts, setShifts] = useState<Shift[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<String | null>(null)

    const fetchShifts = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/shifts")
            setShifts(res.data.data)
        } catch (error: any) {
            setError(error.response?.data?.message || "Gagal mengambil data")
        } finally {
            setIsLoading(false)
        }
    }

    const deleteShift = async (id: string) => {
        try {
            await api.delete(`/shifts/${id}`)
            setShifts((prev) => prev.filter((u) => u._id !== id))
        } catch (err: any) {
            throw new Error(err.response?.data?.message || "Gagal menghapus Shift")
        }
    }

    useEffect(() => {
        fetchShifts()
    }, [])
    
    return {isLoading, error, shifts, fetchShifts, deleteShift}
}