import UsersTable from "@/components/users/users-table"
import { Card, CardContent } from "@/components/ui/card";


const UsersPage = () => {
  return (
    <div className="h-full w-full flex-col space-y-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">
          Manajemen Karyawan
          </h2>
          <p className="text-muted-foreground">
          Kelola data karyawan, termasuk informasi pribadi.
          </p>
        </div>
      {/* <div className="flex items-center justify-between">
      </div> */}
      <div className="space-y-4">
        <Card className="w-full shadow-none">
          <CardContent className="w-full pt-6">
            <UsersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UsersPage