import { useDashboard } from "@/hooks/useDashboard"
import SummaryCards from "@/components/dashboard/summary-card"
import DailyRecapTable from "@/components/dashboard/daily-recap"
import { useAuthStore } from "@/store/authStore"



const Dashboard = () => {
  const { user } = useAuthStore((state) => state)
  
  const { summary, isLoading } = useDashboard()
  return (
    <main className="flex-1 overflow-y-auto space-y-7">

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Here&apos;s an overview for this workspace!</p>
      </div>

      {/* Stat Cards */}
      <SummaryCards summary={summary} isLoading={isLoading} />
      <DailyRecapTable />

    </main>
  )
}

export default Dashboard