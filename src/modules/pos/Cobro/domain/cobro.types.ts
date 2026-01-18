import type { PagoPOS, TipoPago } from '../../pos.types'

/**
 * Estado calculado del cobro.
 *
 * - Se usa solo en frontend
 * - Alimenta la UI (vuelto, falta, validaciones)
 * - No se persiste ni se envía al backend
 */
export interface EstadoCobro {
  totalVenta: number
  totalCobrado: number
  ajusteRedondeo: number
  totalPagado: number
  vuelto: number
  falta: number
  puedeConfirmar: boolean
}

/**
 * Payload final de confirmación de cobro.
 *
 * - Se construye a partir del EstadoCobro
 * - Es el objeto que se envía al backend
 */
export interface ConfirmacionCobro {
  pagos: PagoPOS[]
  ajusteRedondeo: number
  totalCobrado: number
  modo: TipoPago
}