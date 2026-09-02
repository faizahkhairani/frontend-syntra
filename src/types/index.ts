export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  department?: string;
  phone?: string;
  gender: "Male" | "Female";
  isDemo: boolean;
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
  date: string;
  checkIn: { time: string; latitude: number; longitude: number };
  checkOut: { time: string; latitude: number; longitude: number };
  status: "present" | "late" | "absent";
  workDuration: number;
}

export interface LeaveRequest {
  _id: string;
  userId: User;
  type: "annual" | "sick" | "permit" | "maternity";
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: User;
  reviewedAt?: string;
  rejectReason?: string;
}

interface SAWCriteria {
  sisaQuota: number;
  kehadiran: number;
  keterlambatan: number;
}

interface SAWResult {
  score: number;
  rank: number;
  criteria: SAWCriteria;
}

export interface LeaveRecommendation {
  _id: string;
  userId: User;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: string;
  saw: SAWResult;
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