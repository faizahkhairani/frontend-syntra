import { Users, CheckCircle, Clock, CalendarClock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardSummary } from "@/types"
interface SummaryCardsProps {
  summary: DashboardSummary | null
  isLoading: boolean
}

const cards = (summary: DashboardSummary) => [
  {
    title: "Total Karyawan",
    value: summary.employees.total,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Hadir",
    value: summary.attendance.present,
    icon: CheckCircle,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Telat",
    value: summary.attendance.late,
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  // {
  //   title: "Tidak Hadir",
  //   value: summary.attendance.absent,
  //   icon: XCircle,
  //   color: "bg-red-50 text-red-600",
  // },
  // {
  //   title: "Belum Absen",
  //   value: summary.attendance.notYet,
  //   icon: AlertCircle,
  //   color: "bg-slate-50 text-slate-600",
  // },
  {
    title: "Cuti Pending",
    value: summary.leaves.pending,
    icon: CalendarClock,
    color: "bg-purple-50 text-purple-600",
  },
]
const SummaryCard = ({ summary, isLoading }: SummaryCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-none">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards(summary).map((card) => (
        <Card key={card.title} className="text-foreground-accent shadow-none">
          <CardHeader>
            <div className="flex items-center gap-4">
              <card.icon className={`size-5 ${card.color}`} />
              {card.title}
            </div>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-medium">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SummaryCard