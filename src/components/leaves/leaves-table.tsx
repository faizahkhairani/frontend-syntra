import { useLeaves } from "@/hooks/useLeaves"
import { DataTable } from "./table/table"
import { columns } from "./table/column";
import { exportLeavePDF } from "@/lib/pdf"
import { FileDown } from "lucide-react" 

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

const LeavesTable = () => {
    const {
    data,
    loading,
    statusFilter,
    setStatusFilter,
    yearFilter,
    setYearFilter,
    handleApprove,
    handleReject,
  } = useLeaves();
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1].map(String);

  return (
    <div className="space-y-4">
        <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => exportLeavePDF(data, yearFilter)}
        >
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
    <DataTable columns={columns(handleApprove, handleReject)} data={data} isLoading={loading} />
    </div>
  )
}

export default LeavesTable