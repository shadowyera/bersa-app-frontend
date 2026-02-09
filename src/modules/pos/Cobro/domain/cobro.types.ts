import type { PagoPOS, TipoPago } from '../../domain/pos.types'

/* =====================================================
   Estado calculado del cobro (frontend)
===================================================== */

/**
 * Representa el estado financiero
 * calculado de un cobro en curso.
 *
 * - Solo frontend
 * - Alimenta la UI (vuelto, falta, validaciones)
 * - No se persiste
 */
export interface EstadoCobro {
  /**
   * Modo de pago seleccionado
   */
  modo: TipoPago

  /**
   * Total original de la venta
   * (antes de redondeo)
   */
  totalVenta: number

  /**
   * Diferencia generada por redondeo
   * (solo efectivo)
   */
  ajusteRedondeo: number

  /**
   * Total final a cobrar
   * (totalVenta + ajusteRedondeo)
   */
  totalCobrado: number

  /**
   * Dinero entregado por el cliente
   */
  totalPagado: number

  /**
   * Monto a devolver al cliente
   */
  vuelto: number

  /**
   * Monto faltante para completar pago
   */
  falta: number

  /**
   * Indica si el cobro puede confirmarse
   */
  puedeConfirmar: boolean
}

/* =====================================================
   Payload de confirmación
===================================================== */

/**
 * Payload final que se envía al backend
 * al confirmar un cobro.
 */
export interface ConfirmacionCobro {
  /**
   * Desglose de pagos
   * (efectivo, débito, etc.)
   */
  pagos: PagoPOS[]

  /**
   * Ajuste por redondeo CLP aplicado
   */
  ajusteRedondeo: number

  /**
   * Total efectivamente cobrado
   */
  totalCobrado: number

  /**
   * Modo principal del cobro
   */
  modo: TipoPago
}