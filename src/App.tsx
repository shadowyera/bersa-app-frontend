import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/shared/layouts/AppLayout'
import ProtectedRoute from '@/shared/layouts/ProtectedRoute'
import { LoginPage } from '@/modules/auth/LoginPage'
import { PosRoutes } from '@/modules/pos/pos.routes'
import { AdminRoutes } from '@/modules/admin/admin.routes'

export default function App() {
  return (
    <Routes>
      {/* público */}
      <Route path="/login" element={<LoginPage />} />

      {/* protegido */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {PosRoutes}
        {AdminRoutes}
        <Route path="/" element={<Navigate to="/pos" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}