import { Card, CardContent } from "../ui/card"
import { Clock, LogOut, Loader2, CheckCircle, LogIn, MapPin } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {isShiftStarted} from "@/lib/shiftTime"


interface ShiftCardProps {
  shift: {
    _id: string
    shiftId: {
      name: string
      start_time: string
      end_time: string
      overnight: boolean
    }
    date: string
    attendanceStatus: {
      isCheckedIn: boolean
      isCheckedOut: boolean
      checkInTime: string | null
      checkOutTime: string | null
      status: string | null
    }
  }
  isLoading: boolean
  onCheckIn: (id: string) => void
  onCheckOut: (id: string) => void
}

// {
//   _id: "123",

//   shiftId: {
//     name: "Shift Pagi",
//     start_time: "08:00",
//     end_time: "17:00"
//   },

//   attendanceStatus: {
//     isCheckedIn: true,
//     isCheckedOut: false
//   }
// }

const statusConfig: Record<string, { label: string; className: string }> = {
  present: { label: "Hadir",  className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  late:    { label: "Telat",  className: "bg-amber-50 text-amber-700 border-amber-200" },
}



const ShiftCard = ({isLoading, onCheckIn, onCheckOut, shift}: ShiftCardProps) => {
    const shiftStarted = isShiftStarted(shift.shiftId.start_time, shift.shiftId.overnight);
    const { attendanceStatus: att, shiftId } = shift
    
    const status = !shiftStarted 
    ? { label: "Nanti", className: "text-slate-500 border-slate-300 bg-slate-50" }
    : att.status 
    ? statusConfig[att.status] 
    : null;
    
  return (
    <Card className="shadow-none rounded-2xl">
        <CardContent className="px-4 space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-800">{shiftId.name}</p>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{shiftId.start_time} - {shiftId.end_time}</span>
                    </div>
                </div>
                {status && (
                    <Badge variant="outline" className={status.className}>
                    {status.label}
                    </Badge>
                )}
            </div>
            {/* info jam masuk dan keluar */}
            {(att.checkInTime || att.checkOutTime) && (
            <div className="grid grid-cols-2 gap-2 bg-muted/30 rounded-lg p-3">
                <div>
                    <p className="text-xs text-muted-foreground">Masuk</p>
                    <p className="text-sm font-medium"> 
                        {att.checkInTime ?? "-"} 
                    </p>
                    </div>
                    <div>
                    <p className="text-xs text-muted-foreground">Pulang</p>
                    <p className="text-sm font-medium">
                        {att.checkOutTime ?? "-"}
                    </p>
                </div>
            </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
                {/* tombol absen */}
                <Button
                    className="h-10 gap-2 rounded-full"
                    disabled={att.isCheckedIn || !shiftStarted || isLoading}
                    onClick={() => onCheckIn(shift._id)} // klik absen 
                >
                    {isLoading && !att.isCheckedIn ? (
                        <Loader2 className="h-4 w-4 animate-spin" /> // loading
                    ) : att.isCheckedIn ? (
                        <CheckCircle className="h-4 w-4" /> // kalo udh check in
                    ) : (
                        <LogIn className="h-4 w-4" /> // kalo belum
                    )}
                    {att.isCheckedIn ? "Sudah Masuk" : "Absen Masuk"}
                </Button>
                {/* tombol check out */}
                <Button
                    className="h-10 gap-2 rounded-full"
                    variant="outline"
                    disabled={!att.isCheckedIn || att.isCheckedOut || isLoading}
                    onClick={() => onCheckOut(shift._id)}
                >
                    {isLoading && att.isCheckedIn && !att.isCheckedOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : att.isCheckedOut ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <LogOut className="h-4 w-4" />
                    )}
                    {att.isCheckedOut ? "Sudah Pulang" : "Absen Pulang"}
                </Button>
            </div>
            {/* Info lokasi */}
            {/* {!att.isCheckedIn && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>Pastikan GPS aktif dan berada di area petshop</span>
            </div>
            )} */}

        </CardContent>
    </Card>
  )
}

export default ShiftCard