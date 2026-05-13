import { Card, CardContent } from "@/components/ui/card"
import ShiftsTable from "@/components/shifts/shifts-table"

const ShiftsPage = () => {
  return (
    <div className="h-full w-full flex-col space-y-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">
            List of Shift
          </h2>
          <p className="text-muted-foreground">
            Here is the list of all shift enrolled in the petshop.
          </p>
        </div>
      {/* <div className="flex items-center justify-between">
      </div> */}
      <div className="space-y-4">
        <Card className="w-full shadow-none">
          <CardContent className="w-full pt-6">
            <ShiftsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ShiftsPage