import { api } from '@/shared/api/api'
import type { AperturaCaja } from './caja.types'
import { ESTADO_APERTURA_CAJA } from './caja.types'

/* =====================================================
   DTO backend (respuesta real)
===================================================== */

/**
 * Representación EXACTA de la apertura enviada por el backend.
 * ⚠️ No se exporta.
 * ⚠️ No se usa directamente en UI.
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
   API pública (infraestructura)
===================================================== */

/**
 * Obtiene la apertura activa de una caja.
 *
 * - Si no hay apertura, el backend responde null
 * - No contiene reglas de negocio
 */
export async function getAperturaActiva(
  cajaId: string
): Promise<AperturaCaja | null> {
  const { data } = await api.get<AperturaCajaDTO | null>(
    `/cajas/${cajaId}/apertura-activa`
  )

  if (!data) return null
  return normalizarApertura(data)
}

/**
 * Abre una caja.
 *
 * - El backend valida concurrencia
 * - El backend define el usuario de apertura
 */
export async function abrirCaja(params: {
  cajaId: string
  montoInicial: number
}): Promise<AperturaCaja> {
  const { data } = await api.post<AperturaCajaDTO>(
    `/cajas/${params.cajaId}/abrir`,
    {
      montoInicial: params.montoInicial,
    }
  )

  return normalizarApertura(data)
}

/**
 * Obtiene el resumen previo al cierre de caja.
 *
 * 👉 Usado solo para confirmación visual.
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
 * Cierra la caja.
 *
 * - El backend calcula diferencias
 * - El backend define el usuario de cierre
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