import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

interface AttendanceRow {
  employee: {
    name: string
    department: string
  }
  shift: {
    name: string
    start_time: string
    end_time: string
  }
  checkIn: string | null
  checkOut: string | null
  workDurationFormatted: string
  status: "present" | "late" | string
}

const statusConfig = {
  present: {
    label: "Hadir",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  late: {
    label: "Telat",
    className:
      "bg-amber-50 text-amber-700 border-amber-200",
  },
}

export const columns: ColumnDef<AttendanceRow>[] = [
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
    accessorKey: "employee",
    header: "Karyawan",
    cell: ({ row }) => {
      const employee = row.original.employee

      return (
        <div>
          <p className="font-medium text-sm">
            {employee.name}
          </p>

          <p className="text-xs text-muted-foreground">
            {employee.department}
          </p>
        </div>
      )
    },
  },

  {
    accessorKey: "shift",
    header: "Shift",
    cell: ({ row }) => {
      const shift = row.original.shift

      return (
        <div>
          <p className="text-sm">
            {shift.name}
          </p>

          <p className="text-xs text-muted-foreground">
            {shift.start_time} - {shift.end_time}
          </p>
        </div>
      )
    },
  },

  {
    accessorKey: "checkIn",
    header: () => (
      <div className="text-center">
        Check In
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.original.checkIn ?? (
          <span className="text-muted-foreground">
            -
          </span>
        )}
      </div>
    ),
  },

  {
    accessorKey: "checkOut",
    header: () => (
      <div className="text-center">
        Check Out
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.original.checkOut ?? (
          <span className="text-muted-foreground">
            -
          </span>
        )}
      </div>
    ),
  },

  {
    accessorKey: "workDurationFormatted",
    header: () => (
      <div className="text-center">
        Durasi
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.original.workDurationFormatted !== "-"
          ? row.original.workDurationFormatted
          : (
            <span className="text-muted-foreground">
              -
            </span>
          )}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: () => (
      <div className="text-center">
        Status
      </div>
    ),
    cell: ({ row }) => {
      const status =
        statusConfig[
          row.original.status as keyof typeof statusConfig
        ]

      return (
        <div className="text-center">
          {status ? (
            <Badge
              variant="outline"
              className={status.className}
            >
              {status.label}
            </Badge>
          ) : (
            <span className="text-muted-foreground">
              -
            </span>
          )}
        </div>
      )
    },
  },
]