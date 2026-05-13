export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  department?: string;
  phone?: string;
  gender: "Male" | "Female";
  createdAt: string;
}

export interface Shift {
  _id: string;
  name: string;
  start_time: string;
  end_time: string;
  late_tolerance: number;
  overnight: boolean;
}

export interface ShiftSchedule {
  _id: string;
  userId: User;
  shiftId: Shift;
  date: string;
  attendanceStatus?: {
    isCheckedIn: boolean;
    isCheckedOut: boolean;
    checkInTime: string | null;
    checkOutTime: string | null;
    status: string | null;
  };
}

export interface Attendance {
  _id: string;
  userId: User;
  shiftScheduleId: ShiftSchedule;
  shiftId: Shift;
  date: string;
  checkIn: { time: string; latitude: number; longitude: number };
  checkOut: { time: string; latitude: number; longitude: number };
  status: "present" | "late" | "absent";
  workDuration: number;
}

export interface LeaveRequest {
  _id: string;
  userId: User;
  type: "annual" | "sick" | "permit" | "maternity" | "religious";
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: User;
  reviewedAt?: string;
  rejectReason?: string;
}

export interface DashboardSummary {
  today: string;
  employees: { total: number };
  attendance: {
    totalShifts: number;
    present: number;
    late: number;
    notAbsen: number;
  };
  leaves: { pending: number };
}