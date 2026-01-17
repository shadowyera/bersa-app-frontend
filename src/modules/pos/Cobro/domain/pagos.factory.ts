import type { PagoPOS, TipoPago } from '../../pos.types'

interface BuildPagosInput {
  /** Total final cobrado (con redondeo) */
  totalCobrado: number

  /** Modo de pago */
  modo: TipoPago

  /** Monto efectivo validado */
  efectivo: number

  /** Monto débito validado */
  debito: number
}

/**
 * Construye los pagos a persistir
 *
 * ⚠️ Asume que:
 * - los montos YA fueron validados por cobro.logic
 * - efectivo + debito === totalCobrado en MIXTO
 */
export function buildPagos({
  totalCobrado,
  modo,
  efectivo,
  debito,
}: BuildPagosInput): PagoPOS[] {
  switch (modo) {
    case 'EFECTIVO':
      return [
        {
          tipo: 'EFECTIVO',
          monto: totalCobrado,
        },
      ]

    case 'DEBITO':
      return [
        {
          tipo: 'DEBITO',
          monto: totalCobrado,
        },
      ]

    case 'CREDITO':
      return [
        {
          tipo: 'CREDITO',
          monto: totalCobrado,
        },
      ]

    case 'TRANSFERENCIA':
      return [
        {
          tipo: 'TRANSFERENCIA',
          monto: totalCobrado,
        },
      ]

    case 'MIXTO':
      return [
        {
          tipo: 'EFECTIVO',
          monto: efectivo,
        },
        {
          tipo: 'DEBITO',
          monto: debito,
        },
      ]

    default:
      return []
  }
}