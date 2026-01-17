import { api } from '@/shared/api/api'
import type { AperturaCaja } from './caja.types'
import { ESTADO_APERTURA_CAJA } from './caja.types'

/* =====================================================
   DTOs (backend REAL)
===================================================== */

/**
 * Representación EXACTA de lo que envía el backend
 * 👉 No se exporta
 * 👉 Solo se usa para normalizar
 */
interface AperturaCajaDTO {
  _id: string
  cajaId: string
  sucursalId: string

  usuarioAperturaId: string
  usuarioCierreId?: string

  fechaApertura: string
  montoInicial: number

  fechaCierre?: string
  montoFinal?: number
  diferencia?: number

  estado: string
}

/* =====================================================
   Normalizador
   DTO → Dominio frontend
===================================================== */
function normalizarApertura(
  dto: AperturaCajaDTO
): AperturaCaja {
  return {
    id: dto._id,
    cajaId: dto.cajaId,
    sucursalId: dto.sucursalId,

    usuarioAperturaId: dto.usuarioAperturaId,
    usuarioCierreId: dto.usuarioCierreId,

    fechaApertura: dto.fechaApertura,
    montoInicial: dto.montoInicial,

    fechaCierre: dto.fechaCierre,
    montoFinal: dto.montoFinal,
    diferencia: dto.diferencia,

    estado:
      dto.estado as typeof ESTADO_APERTURA_CAJA[keyof typeof ESTADO_APERTURA_CAJA],
  }
}

/* =====================================================
   API pública (infraestructura pura)
===================================================== */

/**
 * Obtiene la apertura activa de una caja
 *
 * 🔑 Reglas:
 * - Si no hay apertura → backend responde null
 * - NO decide nada, solo entrega datos
 */
export async function getAperturaActiva(
  cajaId: string
): Promise<AperturaCaja | null> {
  const { data } = await api.get(
    `/cajas/${cajaId}/apertura-activa`
  )

  if (!data) return null
  return normalizarApertura(data)
}

/**
 * Abre una caja
 *
 * 🔑 Reglas:
 * - Backend valida concurrencia
 * - Backend decide usuarioAperturaId
 */
export async function abrirCaja(params: {
  cajaId: string
  montoInicial: number
}): Promise<AperturaCaja> {
  const { data } = await api.post(
    `/cajas/${params.cajaId}/abrir`,
    {
      montoInicial: params.montoInicial,
    }
  )

  return normalizarApertura(data)
}

/**
 * Obtiene el resumen previo al cierre
 *
 * 👉 Usado SOLO para el modal de confirmación
 * 👉 Sin lógica de negocio frontend
 */
export async function getResumenPrevioCaja(
  cajaId: string
) {
  const { data } = await api.get(
    `/cajas/${cajaId}/resumen-previo`
  )

  return data
}

/**
 * Cierra la caja (automático)
 *
 * 🔑 Reglas:
 * - Backend decide usuario de cierre
 * - Backend calcula diferencias
 */
export async function cerrarCajaAutomatico(params: {
  cajaId: string
  montoFinal: number
}) {
  await api.post(
    `/cajas/${params.cajaId}/cerrar-automatico`,
    {
      montoFinal: params.montoFinal,
    }
  )
}