import type {ColumnDef} from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types";
import { Badge } from "@/components/ui/badge";
import DataTableRowActions from "./table-row-actions";

interface ColumnAction {
    onEdit: (user: User) => void
    onDelete: (user: User) => void
    onResetPassword: (user: User) => void
}

export const getColumn = ({onEdit, onDelete, onResetPassword}: ColumnAction): ColumnDef<User>[] => {
    const columns: ColumnDef<User>[] = [
        {
            id: "no",
            header: "No",
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex
                const pageSize = table.getState().pagination.pageSize

                return row.index + 1 + pageIndex * pageSize
            },
        },
        {
            accessorKey: "name",
            header: "Nama Lengkap",
            cell: ({ row }) => {
                const user = row.original
                const initials = user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)

                return(
                    <div className="flex items-center gap-3 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {initials}
                            </AvatarFallback>
                        </Avatar>
                    <div>
                        <p className="text-sm leading-none truncate">{user.name}</p>
                        <p className="text-xs mt-0.5 truncate">{user.email}</p>
                    </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "gender",
            header: "Jenis Kelamin",
            cell: ({ row }) => (
                <span className="text-sm">
                {row.original.gender ?? "-"}
                </span>
            )
        },
        {
            accessorKey: "department",
            header: "Departemen",
            cell: ({row}) => (
                <span className="text-sm">
                    {row.original.department ?? "-"}
                </span>
            )
        },
        {
            accessorKey: "phone",
            header: "Nomor Telepon",
            cell: ({row}) => (
                <span className="text-sm">
                    {row.original.phone ?? "-"}
                </span>
            )
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
            <Badge variant="outline" className="text-xs capitalize">
                {row.original.role}
            </Badge>
            ),
        },
        {
            id: "action",
            cell: ({row}) => {
                return (
                <>
                    <DataTableRowActions 
                    row={row}
                    onDelete={onDelete}
                    onEdit={onEdit} 
                    onResetPassword={onResetPassword}
                    />
                </>
                );
            }
        }
    ]

    return columns
}
