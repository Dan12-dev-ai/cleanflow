import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import MainLayout from './layouts/MainLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import StaffDashboard from './pages/staff/StaffDashboard'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import RoleGuard from './routes/RoleGuard'
import HomePage from './pages/HomePage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route element={<RoleGuard allowedRole="Admin" />}>
        <Route element={<MainLayout />}><Route path="/admin/:section" element={<AdminDashboard />} /></Route>
      </Route>
      <Route element={<RoleGuard allowedRole="Staff" />}>
        <Route element={<MainLayout />}><Route path="/staff/:section" element={<StaffDashboard />} /></Route>
      </Route>
      <Route element={<RoleGuard allowedRole="Customer" />}>
        <Route element={<MainLayout />}><Route path="/customer/:section" element={<CustomerDashboard />} /></Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppProvider><BrowserRouter><AppRoutes /></BrowserRouter></AppProvider>
}
