import type {ColumnDef} from "@tanstack/react-table"
import type { Attendance } from "@/types";
import { Badge } from "@/components/ui/badge";


const statusConfig = {
  present: { label: "Hadir", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  late:    { label: "Telat", className: "bg-amber-50 text-amber-700 border-amber-200" },
}


export const getColumn = () => {
    const columns: ColumnDef<Attendance>[] = [
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
            cell: ({ row }) => {
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
            accessorKey: "shiftScheduleId",
            header: "Shift",
            cell: ({row}) => {
                const shiftSchedule = row.original.shiftScheduleId
                return(
                    <div>
                       <p className="text-sm font-medium">{shiftSchedule.shiftId.name}</p>
                       <p className="text-xs text-muted-foreground">{shiftSchedule.shiftId.start_time} - {shiftSchedule.shiftId.end_time}</p>
                    </div>
                )
            }
        },
        {
            accessorKey: "checkIn",
            header: "Check in",
            cell: ({row}) => {
                const time = row.original.checkIn?.time
                return time
                    ? <span className="text-sm">{time}</span>
                    : <span className="text-muted-foreground text-sm">-</span>
            }
        },
        {
            accessorKey: "checkOut",
            header: "Check Out",
            cell: ({row}) => {
                const time = row.original.checkOut?.time
                return time
                    ? <span className="text-sm">{time}</span>
                    : <span className="text-muted-foreground text-sm">-</span>
            }
        },
        {
            accessorKey: "date",
            header: "Tanggal",
            cell: ({ row }) => (
            <span className="text-sm">{row.original.date}</span>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({row}) => {
                const status = row.original.status
                const config = statusConfig[status as keyof typeof statusConfig]

                return config
                ? <Badge variant="outline" className={config.className}>{config.label}</Badge>
                : <span className="text-muted-foreground text-sm">-</span>
            }
        },
        {
            accessorKey: "workDuration",
            header: "Durasi",
            cell: ({row}) => {
                const duration = row.original.workDuration
                if (!duration) return <span className="text-muted-foreground text-sm">-</span>

                const h = Math.floor(duration / 60)
                const m = duration % 60
                return <span className="text-sm">{h}h {m}m</span>
            }
        },
    ]
    return columns
}