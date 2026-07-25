import SawTable from "@/components/saw/saw-table"
import { Card, CardContent } from "@/components/ui/card"

const SawPage = () => {
  return (
     <div className="h-full w-full flex-col space-y-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">
          Manajemen Perhitungan Criteria Karyawan
          </h2>
          <p className="text-muted-foreground">
          Kelola data perhitungan criteria karyawan.
          </p>
        </div>
      {/* <div className="flex items-center justify-between">
      </div> */}
      <div className="space-y-4">
        <Card className="w-full shadow-none">
          <CardContent className="w-full pt-6">
            <SawTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SawPage