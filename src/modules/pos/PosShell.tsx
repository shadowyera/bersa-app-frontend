import { Outlet } from 'react-router-dom'
import BarraCajaActiva from './Caja/ui/modals/BarraCajaActiva'
import CerrarCajaModal from './Caja/ui/modals/CerrarCajaModal'

import { useAuth } from '@/modules/auth/useAuth'
import { useCajaRealtime } from './Caja/hooks/useCajaRealtime'

/**
 * PosShell
 *
 * Layout raíz del módulo POS.
 */
export default function PosShell() {
  const { user } = useAuth()

  // 🔥 AQUÍ MISMO
  useCajaRealtime(user?.sucursalId)

  return (
    <div className="relative h-full">
      <BarraCajaActiva />
      <Outlet />
      <CerrarCajaModal />
    </div>
  )
}