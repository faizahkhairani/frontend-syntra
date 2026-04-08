import { Routes, Route } from "react-router-dom"

import DashboardLayout from "../layouts/layouts"



const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<DashboardLayout />}>
        </Route>
    </Routes>
  )
}

export default AppRoutes