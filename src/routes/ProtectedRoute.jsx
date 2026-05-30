import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ roles = [] }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
