import { api } from '@/shared/api/api'
import type { CajaDisponibleUI } from '../hooks/useCajasDisponibles'

/* =====================================================
   DTO backend (respuesta real)
===================================================== */
interface CajaDisponibleDTO {
  _id: string
  nombre: string
  abierta: boolean
  apertura?: {
    usuarioAperturaNombre?: string
    fechaApertura?: string
  }
}

/* =====================================================
   Normalizador
===================================================== */
function normalizarCajaDisponible(
  dto: CajaDisponibleDTO
): CajaDisponibleUI {
  return {
    id: dto._id,
    nombre: dto.nombre,
    abierta: Boolean(dto.abierta),
    usuarioAperturaNombre:
      dto.apertura?.usuarioAperturaNombre,
    fechaApertura: dto.apertura?.fechaApertura,
  }
}

/* =====================================================
   API pública
===================================================== */
export async function getCajasDisponibles(
  sucursalId: string
): Promise<CajaDisponibleUI[]> {
  const { data } = await api.get(
    `/cajas?sucursalId=${sucursalId}`
  )

  return data.map(normalizarCajaDisponible)
}
