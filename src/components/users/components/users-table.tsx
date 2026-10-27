import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTable } from "../table/table"
import { getColumn } from "../table/column"
import { useUsers } from "@/hooks/useUsers"
import type { User } from "@/types"
import { UserFormDialog } from "./user-form-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"
import { ResetPasswordDialog } from "./reset-password-dialog"

type DialogType = "form" | "delete" | "reset" | null

const UsersTable = () => {
  const { users, isLoading, deleteUser, fetchUsers } = useUsers()
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialog, setDialog] = useState<DialogType>(null)

  const openDialog = (type: DialogType, user: User | null = null) => {
    setSelectedUser(user)
    setDialog(type)
  }
  const closeDialog = (open: boolean) => { if (!open) setDialog(null) }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const columns = getColumn({
    onEdit: (u) => openDialog("form", u),
    onDelete: (u) => openDialog("delete", u),
    onResetPassword: (u) => openDialog("reset", u),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button size="sm" className="h-9 gap-1.5" onClick={() => openDialog("form")}>
          <Plus className="h-4 w-4" />
          Tambah Staff
        </Button>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={isLoading} />

      <UserFormDialog
        open={dialog === "form"}
        onOpenChange={closeDialog}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
      <DeleteUserDialog
        open={dialog === "delete"}
        onOpenChange={closeDialog}
        user={selectedUser}
        onConfirm={deleteUser}
      />
      <ResetPasswordDialog
        open={dialog === "reset"}
        onOpenChange={closeDialog}
        user={selectedUser}
      />
    </div>
  )
}

export default UsersTable