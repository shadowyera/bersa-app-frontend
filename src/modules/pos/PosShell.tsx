import { Outlet } from 'react-router-dom'
import BarraCajaActiva from './Caja/ui/modals/BarraCajaActiva'
import SeleccionarCajaModal from './Caja/ui/modals/SeleccionarCajaModal'
import AbrirCajaModal from './Caja/ui/modals/AbrirCajaModal'
import CerrarCajaModal from './Caja/ui/modals/CerrarCajaModal'
import { useAuth } from '../auth/useAuth';

/**
 * PosShell
 *
 * Layout raíz del módulo POS.
 *
 * Responsabilidades:
 * - Validar usuario autenticado
 * - Proveer contexto de Caja
 * - Renderizar barra global
 * - Montar modales globales
 * - Renderizar rutas hijas (Outlet)
 */
export default function PosShell() {
  const { user } = useAuth()
  if (!user) return null

  return (
    
      <div className="relative h-full">
        <BarraCajaActiva />
        <Outlet />
        <SeleccionarCajaModal />
        <AbrirCajaModal />
        <CerrarCajaModal />
      </div>
  )
}