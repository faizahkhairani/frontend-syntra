import { MoreHorizontal, Pencil, Trash2, KeyRound } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types"
import type { Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface DataTableRowActionsProps {
    row: Row<User>
    onEdit: (user: User) => void,
    onDelete: (user: User) => void,
    onResetPassword: (user: User) => void
}

const DataTableRowActions = ({
  row, 
  onDelete, 
  onEdit, 
  onResetPassword
}: DataTableRowActionsProps) => {
  const user = row.original  // ← ambil data user dari row
  // user = { _id: "...", name: "Budi", email: "...", ... }


  return (
    <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit Staff
            </DropdownMenuItem>
            <DropdownMenuItem
            onClick={() => onResetPassword(user)}
            className="cursor-pointer"
            >
            <KeyRound className="mr-2 h-3.5 w-3.5" />
              Edit Password
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="cursor-pointer text-red-500 focus:text-red-500"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default DataTableRowActions