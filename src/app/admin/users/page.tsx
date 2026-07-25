import UsersTable from "@/components/users/users-table"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mars, Venus } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";


const UsersPage = () => {
  const { users, isLoading } = useUsers()

  const maleCount = users.filter((u) => u.gender === "Male").length
  const femaleCount = users.filter((u) => u.gender === "Female").length

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
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        <Card className="text-foreground-accent shadow-none">
          <CardHeader>
            {isLoading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Mars className="text-blue-500" />
                <p className="text-lg">Laki Laki</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="mt-7">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-xl">{maleCount}</p>
            )}
          </CardContent>
        </Card>
        <Card className="text-foreground-accent shadow-none">
          <CardHeader>
            {isLoading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Venus className="text-pink-500" />
                <p className="text-lg">Perempuan</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="mt-7">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-xl">{femaleCount}</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="w-full shadow-none">
          <CardContent className="w-full pt-6">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full rounded-md" style={{ opacity: 1 - i * 0.08 }} />
                ))}
              </div>
            ) : (
              <UsersTable />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UsersPage