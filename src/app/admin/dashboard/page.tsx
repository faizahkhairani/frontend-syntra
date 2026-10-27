import { useDashboard } from "@/hooks/useDashboard"
import SummaryCards from "@/components/dashboard/summary-card"
import DailyRecapTable from "@/components/dashboard/daily-recap"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { LeaveRequestChart } from "@/components/dashboard/leave-recap"
import PendingLeaveTable from "@/components/dashboard/pending-leave"



const Dashboard = () => {
  
  const { summary, isLoading, attendanceData, leaveStatusData } = useDashboard()

  return (
  <main className="flex-1 space-y-6 overflow-y-auto p-1">
    {/* Heading */}
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight">
        Selamat Datang, Admin!
      </h1>
      <p className="text-sm text-muted-foreground">
        Selamat datang kembali! Berikut ringkasan aktivitas hari ini.
      </p>
    </div>
    <SummaryCards summary={summary} isLoading={isLoading} />

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <AttendanceChart
        data={attendanceData}
        isLoading={isLoading}
      />
      <LeaveRequestChart
        data={leaveStatusData}
        isLoading={isLoading}
      />
    </div>

    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">

      <div className="min-w-0 lg:col-span-2">
        <DailyRecapTable />
      </div>


      <div className="min-w-0 lg:col-span-1">
        <div className="leave-table-scroll">
          <PendingLeaveTable />
        </div>
      </div>
    </div>
  </main>
);
}

export default Dashboard