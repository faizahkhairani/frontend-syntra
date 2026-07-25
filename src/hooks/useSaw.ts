import { useState, useEffect } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import type { LeaveRecommendation } from "@/types"

export function useRecommendations() {
    const [data, setData] = useState<LeaveRecommendation[]>([])
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = async () => {
        setLoading(true)
        try {
            const res = await api.get("/leaves/recommendations")
            setData(res.data.data)
            console.log(res.data.data)
        } catch (error) {
            toast.error("Gagal memuat data cuti");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
      fetchRecommendations()
    }, [])
    
    return {data, loading}
}