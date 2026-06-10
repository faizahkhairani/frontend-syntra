import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AttendanceFilter as FilterType, FilterMode, AttendanceStatus } from "@/hooks/useAttendance";
import { FileDown } from "lucide-react";

interface Props {
  currentFilter: FilterType;
  onApply: (filter: FilterType) => void;
  onReset: () => void;
  onExportPDF?: () => void;
}

const MONTHS = [
  { value: "1", label: "Januari" }, { value: "2",  label: "Februari" },
  { value: "3", label: "Maret" },   { value: "4",  label: "April" },
  { value: "5", label: "Mei" },     { value: "6",  label: "Juni" },
  { value: "7", label: "Juli" },    { value: "8",  label: "Agustus" },
  { value: "9", label: "September"},{ value: "10", label: "Oktober" },
  { value: "11",label: "November" },{ value: "12", label: "Desember" },
];

const now = new Date();
const YEARS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]
  .map((y) => ({ value: String(y), label: String(y) }));

export function AttendanceFilter({ currentFilter, onApply, onReset, onExportPDF }: Props) {
  const [mode, setMode]     = useState<FilterMode>(currentFilter.mode);
  const [status, setStatus] = useState<AttendanceStatus>(currentFilter.status ?? "");
  const [month, setMonth]   = useState(currentFilter.month ?? String(now.getMonth() + 1));
  const [year, setYear]     = useState(currentFilter.year  ?? String(now.getFullYear()));

  const handleApply = () => {
    if (mode === "today") {
      onApply({
        mode: "today",
        date: format(new Date(), "yyyy-MM-dd"),
        status: status || undefined,
      });
    } else {
      onApply({ mode: "month", month, year, status: status || undefined });
    }
  };

  const handleReset = () => {
    setMode("today");
    setStatus("");
    setMonth(String(now.getMonth() + 1));
    setYear(String(now.getFullYear()));
    onReset();
  };

  return (
    <div className="flex flex-wrap items-end gap-3">

      {/* Mode toggle */}
      <div className="flex flex-col gap-1.5">
        <Label>Tampilkan</Label>
        <div className="flex rounded-md border overflow-hidden">
          {(["today", "month"] as FilterMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 h-9 text-sm font-medium transition-colors
                ${mode === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
                }`}
            >
              {m === "today" ? "Hari ini" : "Per bulan"}
            </button>
          ))}
        </div>
      </div>

      {/* Tanggal (readonly, auto = hari ini) */}
      {mode === "today" && (
        <div className="flex flex-col gap-1.5">
          <Label>Tanggal</Label>
          <div className="h-9 px-3 flex items-center rounded-md border bg-muted text-sm text-muted-foreground">
            {format(new Date(), "dd MMMM yyyy", { locale: id })}
          </div>
        </div>
      )}

      {/* Bulan + Tahun */}
      {mode === "month" && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label>Bulan</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-32.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Tahun</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-25"><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <Label>Status</Label>
        <Select
          value={status || "all"}
          onValueChange={(v) => setStatus(v === "all" ? "" : v as AttendanceStatus)}
        >
          <SelectTrigger className="w-32.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="present">Hadir</SelectItem>
            <SelectItem value="late">Telat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleApply}>Terapkan</Button>
        {/* Muncul hanya saat mode month */}
        {mode === "month" && onExportPDF && (
            <Button variant="outline" onClick={onExportPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
            </Button>
        )}
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
}