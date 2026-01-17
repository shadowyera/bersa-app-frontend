import { Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/useAuth'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  // ⏳ Mientras se valida sesión, NO redirigir
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400">
        Cargando sesión…
      </div>
    )
  }

  // ❌ No autenticado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ✅ Autenticado
  return <>{children}</>
}