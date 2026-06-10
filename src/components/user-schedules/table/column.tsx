import type {ColumnDef} from "@tanstack/react-table"
import type { ShiftSchedule } from "@/types";
import { Badge } from "@/components/ui/badge";
import DataTableRowActions from "./table-row-actions";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ColumnAction {
    onDelete: (shiftSchedule: ShiftSchedule) => void
}

export const getColumn = ({onDelete}: ColumnAction) => {
    const columns: ColumnDef<ShiftSchedule>[] = [
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
            accessorKey: "userId",
            header: "Nama Staff",
            cell: ({row}) => {
                const user = row.original.userId
                return(
                    <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                )
            }
        },
        {
            accessorKey: "shiftId",
            header: "Jadwal Shift",
            cell: ({ row }) => {
            const shift = row.original.shiftId // ← object Shift
            return (
                <div>
                <p className="text-sm font-medium">{shift.name}</p>
                <p className="text-xs text-muted-foreground">
                    {shift.start_time} - {shift.end_time}
                </p>
                </div>
            )
            }
        },
        {
            accessorKey: "date",
            header: "Tanggal",
            cell: ({ row }) => 
            format(new Date(row.original.date), "dd MMM yyyy", { locale: id }),
        },
        {
            id: "overnight",
            header: "Keterangan",
            cell: ({ row }) => {
            const shift = row.original.shiftId
            return shift.overnight
                ? <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Overnight</Badge>
                : <span className="text-muted-foreground text-sm">-</span>
            }
        },
        {
            id: "action",
            cell: ({row}) => {
                return (
                <>
                    <DataTableRowActions 
                    row={row}
                    onDelete={onDelete}
                    />
                </>
                );
            }
        }

    ]
    return columns
}