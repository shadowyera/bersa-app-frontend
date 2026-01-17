import AbastecimientoForm from './AbastecimientoForm'
import MovimientosRecientes from './MovimientosRecientes'
import { useAuth } from '@/modules/auth/useAuth'

export default function AbastecimientoPage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <AbastecimientoForm />
      <MovimientosRecientes
        sucursalId={user.sucursalId}
      />
    </div>
  )
}