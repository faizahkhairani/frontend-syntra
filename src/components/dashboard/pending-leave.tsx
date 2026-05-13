import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/lib/axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface LeaveRequest {
  _id: string
  userId: { name: string; department: string }
  type: string
  startDate: string
  endDate: string
  duration: number
  reason: string
}

const typeLabel: Record<string, string> = {
  annual: "Tahunan",
  sick: "Sakit",
  permit: "Izin",
  maternity: "Melahirkan",
  religious: "Keagamaan",
}

const PendingLeaveTable = () => {
  const [data, setData] = useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPendingLeaves = async () => {
      try {
        const res = await api.get("/leaves?status=pending")
        setData(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPendingLeaves()
  }, [])

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Pengajuan Cuti Pending
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/leaves" className="text-xs text-muted-foreground">
            Lihat semua →
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="pl-6">Karyawan</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Alasan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Tidak ada pengajuan cuti pending
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell className="pl-6">
                    <div>
                      <p className="font-medium text-sm">{row.userId.name}</p>
                      <p className="text-xs text-muted-foreground">{row.userId.department}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {typeLabel[row.type] ?? row.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {row.startDate} – {row.endDate}
                  </TableCell>
                  <TableCell className="text-sm">
                    {row.duration} hari
                  </TableCell>
                  <TableCell className="text-sm max-w-50 truncate text-muted-foreground">
                    {row.reason}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default PendingLeaveTable