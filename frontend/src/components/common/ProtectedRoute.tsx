import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@store/index'
import authService from '@services/authService'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedProfiles?: string[]
}

function ProtectedRoute({ children, allowedProfiles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  // Verificar si hay token en localStorage
  const hasToken = authService.isAuthenticated()

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />
  }

  // Si hay perfiles permitidos, verificar
  if (allowedProfiles && allowedProfiles.length > 0 && user) {
    if (!allowedProfiles.includes(user.profile.name)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
