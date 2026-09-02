
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import { useEffect, useState } from "react"
import api from "@/lib/axios"

import { DataTable } from "./table/table"
import { columns } from "./table/column"
import { Badge } from "../ui/badge"

interface DailyRecap {
  employee: { _id: string; name: string; department: string }
  shift: { name: string; start_time: string; end_time: string }
  checkIn: string | null
  checkOut: string | null
  status: "present" | "late" | "notAbsen"
  workDurationFormatted: string
}


const DailyRecapTable = () => {
  const [data, setData] = useState<DailyRecap[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDailyRecap = async () => {
      try {
        const res = await api.get("/dashboard/daily-recap")
        setData(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDailyRecap()
  }, [])

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <p className="text-lg font-semibold">Absensi Hari ini</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
            </p>
          </div>
          <Badge variant="secondary" className="font-normal">
            {data.length} karyawan
          </Badge>
      </CardHeader>
      <CardContent>
        <div className="w-full space-y-4">
            <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            />
        </div>
      </CardContent>
    </Card>
  )
}

export default DailyRecapTable