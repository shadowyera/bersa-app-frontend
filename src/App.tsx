import { Routes, Route, Navigate } from 'react-router-dom'

import AppLayout from '@/shared/layouts/AppLayout'
import ProtectedRoute from '@/shared/layouts/ProtectedRoute'

import { LoginPage } from '@/modules/auth/LoginPage'
import { PosRoutes } from '@/modules/pos/pos.routes'
import { AdminRoutes } from '@/modules/admin/admin.routes'

import { RealtimeProvider } from '@/shared/realtime/RealtimeProvider'
import { ToastProvider } from '@/shared/ui/toast/ToastProvider'

/**
 * =====================================================
 * App
 *
 * - Define ruteo global
 * - Monta infraestructura de aplicación
 * - NO contiene lógica de dominio
 * =====================================================
 */
export default function App() {
  return (
    <RealtimeProvider>
      <ToastProvider>
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
            <Route
              path="/"
              element={<Navigate to="/pos" replace />}
            />
          </Route>

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </ToastProvider>
    </RealtimeProvider>
  )
}