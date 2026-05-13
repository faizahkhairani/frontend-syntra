import type {ColumnDef} from "@tanstack/react-table"
import type { Shift } from "@/types";
import DataTableRowActions from "./table-row-actions";
import { Badge } from "@/components/ui/badge";

interface ColumnAction {
    onEdit: (shift: Shift) => void
    onDelete: (shift: Shift) => void
}

export const getColumn = ({onEdit, onDelete}: ColumnAction) => {
    const columns: ColumnDef<Shift>[] = [
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
            header: "Nama Shift",
            cell: ({row}) => (
                <span className="text-sm">
                    {row.original.name}
                </span>
            )
        },
        {
            accessorKey: "start_time",
            header: "Jam Mulai",
            cell: ({row}) => (
                <span className="text-sm">
                    {row.original.start_time}
                </span>
            )
        },
        {
            accessorKey: "end_time",
            header: "Jam Selesai",
            cell: ({row}) => (
                <span className="text-sm">
                    {row.original.end_time}
                </span>
            )
        },
        {
            accessorKey: "late_tolerance",
            header: "Toleransi Waktu",
            cell: ({row}) => (
                <span className="text-sm">
                    {row.original.late_tolerance} menit
                </span>
            )
        },
        {
            accessorKey: "overnight",
            header: "Overnight",
            cell: ({ row }) => (
                row.original.overnight
                ? <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Overnight</Badge>
                : <span className="text-sm text-muted-foreground">-</span>
            )
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
                    />
                </>
                );
            }
        }
    ]
    return columns
}