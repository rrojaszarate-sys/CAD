import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import Dashboard from './components/layouts/Dashboard'

function AppRouter() {
  // TODO: Implementar protección de rutas con autenticación
  const isAuthenticated = false

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {isAuthenticated ? (
        <Route path="/*" element={<Dashboard />} />
      ) : (
        <Route path="/*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  )
}

export default AppRouter
