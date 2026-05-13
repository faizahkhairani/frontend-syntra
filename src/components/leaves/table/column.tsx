
import type { ColumnDef } from "@tanstack/react-table";
import type { LeaveRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import TableRowActions from "./table-row-actions";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const leaveTypeLabel: Record<string, string> = {
  annual: "Tahunan",
  sick: "Sakit",
  permit: "Izin",
  maternity: "Melahirkan",
  religious: "Keagamaan",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

export const columns = (
  onApprove: (request: LeaveRequest) => void,
  onReject: (request: LeaveRequest, reason: string) => void
): ColumnDef<LeaveRequest>[] => [
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
    accessorKey: "userId.name",
    header: "Staff",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.userId.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.userId.department}</p>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipe Cuti",
    cell: ({ row }) => leaveTypeLabel[row.original.type] ?? row.original.type,
  },
  {
    accessorKey: "startDate",
    header: "Tanggal Mulai",
    cell: ({ row }) =>
      format(new Date(row.original.startDate), "dd MMM yyyy", { locale: id }),
  },
  {
    accessorKey: "endDate",
    header: "Tanggal Selesai",
    cell: ({ row }) =>
      format(new Date(row.original.endDate), "dd MMM yyyy", { locale: id }),
  },
  {
    accessorKey: "duration",
    header: "Durasi",
    cell: ({ row }) => `${row.original.duration} hari`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status] ?? "outline"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <TableRowActions
        row={row}
        onApprove={onApprove}
        onReject={onReject}
      />
    ),
  },
];