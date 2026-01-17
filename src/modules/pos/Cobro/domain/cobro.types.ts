import type { PagoPOS, TipoPago } from '../../pos.types'

/**
 * Estado calculado del cobro
 * ⚠️ NO es estado de backend
 * ⚠️ NO se persiste
 *
 * Se usa solo para UI y validaciones
 */
export interface EstadoCobro {
  /** Total original de la venta */
  totalVenta: number

  /** Total luego de aplicar redondeo */
  totalCobrado: number

  /** Ajuste aplicado por redondeo */
  ajusteRedondeo: number

  /** Monto total ingresado por el cliente */
  totalPagado: number

  /** Dinero a devolver al cliente */
  vuelto: number

  /** Monto faltante para completar el cobro */
  falta: number

  /** Indica si el cobro cumple las reglas para confirmarse */
  puedeConfirmar: boolean
}

/**
 * Payload FINAL de cobro
 * 👉 Este objeto se envía al backend
 */
export interface ConfirmacionCobro {
  /** Detalle de pagos registrados */
  pagos: PagoPOS[]

  /** Ajuste aplicado por redondeo */
  ajusteRedondeo: number

  /** Total cobrado (con redondeo) */
  totalCobrado: number

  /** Modo de pago seleccionado */
  modo: TipoPago
}