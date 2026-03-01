import { Outlet } from 'react-router-dom'
import BarraCajaActiva from './caja/ui/modals/BarraCajaActiva'
import CerrarCajaModal from './caja/ui/modals/CerrarCajaModal'

import { useAuth } from '@/modules/auth/useAuth'
import { useCajaRealtime } from './caja/hooks/useCajaRealtime'

/**
 * PosShell
 *
 * Layout raíz del módulo POS.
 * Controla altura completa del viewport.
 */
export default function PosShell() {
  const { user } = useAuth()

  useCajaRealtime(user?.sucursal?.id)

  return (
    // NOTE: removí overflow-hidden del root para evitar recortes globales
    <div className="flex flex-col bg-background flex-1 min-h-0">

      {/* Barra superior de caja */}
      <BarraCajaActiva />

      {/* Contenido dinámico del POS */}
      {/* Mantengo overflow-hidden aquí para que el contenido principal controle su propio overflow */}
      <main className="flex-1 min-h-0 flex flex-col">
        <Outlet />
      </main>

      <CerrarCajaModal />

    </div>
  )
}