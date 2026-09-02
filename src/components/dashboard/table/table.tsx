import {
  useReactTable, getCoreRowModel,
  getFilteredRowModel, getPaginationRowModel,
  flexRender, type ColumnDef,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTablePagination } from "@/components/data-table-pagination"
import { Inbox } from "lucide-react"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
}

export function DataTable<TData>({
  columns, data, isLoading,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="space-y-4 w-full">
      <div className="rounded-lg border overflow-hidden">
        <Table>
      <TableHeader className="uppercase text-[12px] text-muted-foreground bg-accent">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="h-14 text-[14px] text-black"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {columns.map((_, j) => (
                <TableCell key={j} className="py-3">
                  <Skeleton className="h-4 w-full" style={{ opacity: 1 - i * 0.12 }} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : table.getRowModel().rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className="h-40 text-center">
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Inbox className="h-8 w-8 opacity-40" />
                <p className="text-sm font-medium">Belum ada data absensi</p>
                <p className="text-xs">Data akan muncul setelah karyawan check in</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="transition-colors hover:bg-muted/40 not-last:border-b"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}