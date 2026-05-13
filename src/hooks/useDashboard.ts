import { useState, useEffect } from "react"
import api from "@/lib/axios"
import type { DashboardSummary } from "@/types"

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    fetchSummary()
  }, [])

  return { summary, isLoading, error, refetch: fetchSummary }
}