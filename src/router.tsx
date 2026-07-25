import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import AdminLayout from "./app/admin/layouts";
import Dashboard from "./app/admin/dashboard/page";
import LoginPage from "./app/admin/sign-in/page";
import UsersPage from "./app/admin/users/page";
import ShiftsPage from "./app/admin/shifts/page";
import UserSchedules from "./app/admin/user-schedules/page";
import AttendancesPage from "./app/admin/attendances/page";
import LeavePage from "./app/admin/leaves/page";
import SawPage from "./app/admin/saw/page";

import EmployeeLayout from "./app/employee/layout";
import MyDashboard from "./app/employee/dashboard/page";
import MyAttendance from "./app/employee/attendance/page";
import MySchedule from "./app/employee/schedule/page";
import MyLeaves from "./app/employee/leave/page";

// pakai selector langsung
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user)

 if (user?.role !== "admin"){
  return <Navigate to="/beranda" replace />
 }
 return <>{children}</>
}

const EmployeeRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user)
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminRoute><AdminLayout /></AdminRoute>      
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminRoute><Dashboard /></AdminRoute> },
      {
        path: "users",
        element: <AdminRoute><UsersPage /></AdminRoute>,
      },
      {
        path: "shifts",
        element: <AdminRoute><ShiftsPage /></AdminRoute>,
      },
      {
        path: "schedules",
        element: <AdminRoute><UserSchedules /></AdminRoute>,
      },
      {
        path: "attendances",
        element: <AdminRoute><AttendancesPage /></AdminRoute>,
      },
      {
        path: "leaves",
        element: <AdminRoute><LeavePage /></AdminRoute>,
      },
      {
        path: "saw",
        element: <AdminRoute><SawPage /></AdminRoute>,
      },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/beranda" replace /> },
      { path: "beranda", element: <EmployeeRoute><MyDashboard /></EmployeeRoute> },
      { path: "jadwal", element: <EmployeeRoute><MySchedule /></EmployeeRoute> },
      { path: "absensi", element: <EmployeeRoute><MyAttendance /></EmployeeRoute> },
      { path: "cuti", element: <EmployeeRoute><MyLeaves /></EmployeeRoute> },
    ]
  }
])