import { useState, useEffect } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"

interface QuotaProps {
  used: number
  remaining: number
}

interface LeaveType {
  value: string
  label: string
  deductsQuota: boolean
  fixedDuration: number | null
  maxDuration: number | null
}

interface LeavesProps {
  _id: string,
  type: string,
  startDate: string;
  endDate: string;
  duration: number;
  status: string
}


export const useMyLeaves = () => {
  const [data, setData] = useState<LeavesProps[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [quota, setQuota] = useState<QuotaProps | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0, page: 1, limit: 5, totalPages: 0
  })
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterYear, setFilterYear] = useState(
    String(new Date().getFullYear())
  )

  const fetchLeaves = async (page = 1) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()

      params.append("page", String(page))
      params.append("limit", "5")

      // kalo statusnya all jangan kirim
      if (filterStatus !== "all") params.append("status", filterStatus)
      if (filterYear) params.append("year", filterYear)

      const res = await api.get(`/leaves/my-requests?${params.toString()}`)
      setData(res.data.data)
      setPagination(res.data.pagination)
    } catch (err: any) {
      toast.error("Gagal mengambil data cuti")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchQuota = async () => {
    try {
      setIsLoading(true)
      const res = await api.get("/leaves/my-quota")
      setQuota(res.data.data)
    } catch (error) {
      toast.error("Gagal mengambil data kuota cuti")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLeaveTypes = async () => {
    try {
      setIsLoading(true)
      const res = await api.get("/leaves/types")
      // console.log(res)
      setLeaveTypes(res.data.data)
    } catch (error) {
      toast.error("Gagal mengambil data tipe cuti")
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchLeaves(1)
    fetchQuota()
    fetchLeaveTypes()
    // fetchLeaveTypes()
  }, [filterStatus, filterYear])

  return {
    data,
    isLoading,
    pagination,
    filterStatus,
    filterYear,
    setFilterStatus,
    setFilterYear,
    fetchLeaves,
    fetchQuota,
    fetchLeaveTypes,
    quota,
    leaveTypes
  }
}