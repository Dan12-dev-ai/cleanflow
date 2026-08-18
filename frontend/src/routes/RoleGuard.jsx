import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function RoleGuard({ allowedRole }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== allowedRole) return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
  return <Outlet />
}
