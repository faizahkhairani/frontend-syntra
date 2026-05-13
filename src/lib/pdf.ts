import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { Attendance, LeaveRequest } from "@/types"

// ── Header PDF ──────────────────────────
const addHeader = (doc: jsPDF, title: string, subtitle: string) => {
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Petshop Alit Vet", 14, 15)

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(title, 14, 22)

  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(subtitle, 14, 28)
  doc.text(
    `Dicetak: ${format(new Date(), "dd MMM yyyy, HH:mm", { locale: id })}`,
    14, 33
  )

  doc.setTextColor(0)
  doc.setLineWidth(0.3)
  doc.line(14, 36, 196, 36)
}

// ── Export Rekap Absensi ─────────────────
export const exportAttendancePDF = (
  data: Attendance[],
  month: string,
  year: string
) => {
  const doc = new jsPDF()

  const monthName = format(new Date(`${year}-${month}-01`), "MMMM yyyy", { locale: id })

  addHeader(
    doc,
    "Rekap Absensi Karyawan",
    `Periode: ${monthName}`
  )

  // group by userId — rekap per karyawan
  const grouped: Record<string, {
    name: string
    department: string
    present: number
    late: number
    totalDuration: number
  }> = {}

  data.forEach((a) => {
    const id = a.userId._id
    if (!grouped[id]) {
      grouped[id] = {
        name: a.userId.name,
        department: a.userId.department ?? "-",
        present: 0,
        late: 0,
        totalDuration: 0,
      }
    }
    if (a.status === "present") grouped[id].present++
    if (a.status === "late") grouped[id].late++
    grouped[id].totalDuration += a.workDuration ?? 0
  })

  const rows = Object.values(grouped).map((g, i) => [
    i + 1,
    g.name,
    g.department,
    g.present,
    g.late,
    g.present + g.late, // total hadir
    `${Math.floor(g.totalDuration / 60)}h ${g.totalDuration % 60}m`,
  ])

  autoTable(doc, {
    startY: 40,
    head: [["No", "Nama", "Department", "Hadir", "Telat", "Total", "Durasi Kerja"]],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [16, 185, 129] }, // emerald
    alternateRowStyles: { fillColor: [245, 245, 245] },
  })

  doc.save(`rekap-absensi-${monthName}.pdf`)
}

// ── Export Rekap Cuti ────────────────────
export const exportLeavePDF = (
  data: LeaveRequest[],
  year: string
) => {
  const doc = new jsPDF()

  addHeader(
    doc,
    "Rekap Cuti Karyawan",
    `Tahun: ${year}`
  )

  const leaveTypeLabel: Record<string, string> = {
    annual:    "Tahunan",
    sick:      "Sakit",
    permit:    "Izin",
    maternity: "Melahirkan",
    religious: "Keagamaan",
  }

  const statusLabel: Record<string, string> = {
    approved: "Disetujui",
    rejected: "Ditolak",
    pending:  "Menunggu",
  }

  const rows = data.map((l, i) => [
    i + 1,
    l.userId.name,
    l.userId.department ?? "-",
    leaveTypeLabel[l.type] ?? l.type,
    format(new Date(l.startDate), "dd MMM yyyy", { locale: id }),
    format(new Date(l.endDate), "dd MMM yyyy", { locale: id }),
    `${l.duration} hari`,
    statusLabel[l.status] ?? l.status,
  ])

  autoTable(doc, {
    startY: 40,
    head: [["No", "Nama", "Tipe", "Mulai", "Selesai", "Durasi", "Status"]],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [16, 185, 129] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  })

  doc.save(`rekap-cuti-${year}.pdf`)
}