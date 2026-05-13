import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Shift } from "@/types"
import type { Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface DataTableRowActionsProps {
  row: Row<Shift>
  onEdit: (shift: Shift) => void,
  onDelete: (shift: Shift) => void,
}

const DataTableRowActions = ({row, onDelete, onEdit}: DataTableRowActionsProps) => {
  const shift = row.original  // ← ambil data shift dari row


  return (
    <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(shift)} className="cursor-pointer">
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit Shift
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem
              onClick={() => onDelete(shift)}
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

