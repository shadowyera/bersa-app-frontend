import { Outlet } from 'react-router-dom'
import BarraCajaActiva from './caja/ui/modals/BarraCajaActiva'
import CerrarCajaModal from './caja/ui/modals/CerrarCajaModal'

import { useAuth } from '@/modules/auth/useAuth'
import { useCajaRealtime } from './caja/hooks/useCajaRealtime'

/**
 * PosShell
 *
 * Layout raíz del módulo POS.
 */
export default function PosShell() {
  const { user } = useAuth()

  useCajaRealtime(user?.sucursal?.id)

  return (
    <div className="relative h-full">
      <BarraCajaActiva />
      <Outlet />
      <CerrarCajaModal />
    </div>
  )
}