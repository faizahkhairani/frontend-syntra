import type {ColumnDef} from "@tanstack/react-table"
import type { LeaveRecommendation } from "@/types";
import {
  Wallet,
  CalendarCheck,
  Clock3,
} from "lucide-react";

const leaveTypeLabel: Record<string, string> = {
  annual: "Tahunan",
  sick: "Sakit",
  permit: "Izin",
  maternity: "Melahirkan",
  religious: "Keagamaan",
};


export const getColumn = () => {
    const columns: ColumnDef<LeaveRecommendation>[] = [
        {
            id: "rank",
            header: "rank",
            cell: ({row}) => {
                return row.original.saw.rank
            }
        },
        {
            accessorKey: "userId",
            header: "Nama Lengkap",
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
            accessorKey: "type",
            header: "Tipe Cuti",
            cell: ({ row }) => leaveTypeLabel[row.original.type] ?? row.original.type,
        },
        {
            id: "criteria",
            accessorKey: "saw",
            header: "Kriteria",
            cell: ({row}) => {
                const { sisaQuota, kehadiran, keterlambatan } =
                row.original.saw.criteria;
                return(
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-blue-500" />
                        <span>Sisa Quota: {sisaQuota}</span>
                        </div>

                        <div className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4 text-green-500" />
                        <span>Kehadiran: {kehadiran}%</span>
                        </div>

                        <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-orange-500" />
                        <span>Keterlambatan: {keterlambatan}x</span>
                        </div>
                    </div>
                )
            }
        },
        {
            id: "score",
            accessorKey: "saw",
            header: "Skor SAW",
            cell: ({row}) => {
                const score = row.original.saw.score
                return(
                    <div className="w-40 space-y-1">
                    <div className="flex justify-between text-xs">
                        <span>{score.toFixed(2)}</span>
                        <span>{(score * 100).toFixed(0)}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${score * 100}%` }}
                        />
                    </div>
                    </div>
                )
            }
        }
        
    ]
    return columns
}