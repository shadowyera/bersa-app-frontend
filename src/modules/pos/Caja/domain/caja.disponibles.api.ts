import { api } from '@/shared/api/api'
import type { CajaDisponibleUI } from '../hooks/useCajasDisponibles'

/* =====================================================
   DTO backend
===================================================== */

/**
 * Forma REAL de la respuesta del backend.
 * ⚠️ No usar directamente en UI.
 */
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

/**
 * Normaliza una caja desde DTO a modelo UI.
 */
function normalizarCajaDisponible(
  dto: CajaDisponibleDTO
): CajaDisponibleUI {
  return {
    id: dto._id,
    nombre: dto.nombre,
    abierta: Boolean(dto.abierta),
    usuarioAperturaNombre:
      dto.apertura?.usuarioAperturaNombre,
    fechaApertura:
      dto.apertura?.fechaApertura,
  }
}

/* =====================================================
   API pública
===================================================== */

/**
 * Obtiene las cajas disponibles de una sucursal.
 * Devuelve datos ya listos para UI.
 */
export async function getCajasDisponibles(
  sucursalId: string
): Promise<CajaDisponibleUI[]> {
  const { data } = await api.get<CajaDisponibleDTO[]>(
    `/cajas?sucursalId=${sucursalId}`
  )

  return data.map(normalizarCajaDisponible)
}