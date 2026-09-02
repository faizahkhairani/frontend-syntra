import { useDashboard } from "@/hooks/useDashboard"
import SummaryCards from "@/components/dashboard/summary-card"
import DailyRecapTable from "@/components/dashboard/daily-recap"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { LeaveRequestChart } from "@/components/dashboard/leave-recap"



const Dashboard = () => {
  
  const { summary, isLoading, attendanceData, leaveStatusData } = useDashboard()

  return (
    <main className="flex-1 overflow-y-auto space-y-7">

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Selamat Datang, Admin!</h1>
        <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan aktivitas hari ini.</p>
      </div>

      {/* Stat Cards */}
      <SummaryCards summary={summary} isLoading={isLoading} />

      <div className="grid gap-4 lg:grid-cols-2">
        <AttendanceChart data={attendanceData} isLoading={isLoading} />
        <LeaveRequestChart data={leaveStatusData} isLoading={isLoading} />
      </div>
        <DailyRecapTable />
      {/* <div className="grid gap-4 lg:grid-cols-2 flex-1">
        <PendingLeaveTable />
      </div> */}

    </main>
  )
}

export default Dashboard