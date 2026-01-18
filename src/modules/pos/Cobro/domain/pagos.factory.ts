import type { PagoPOS, TipoPago } from '../../pos.types'

interface BuildPagosInput {
  totalCobrado: number
  modo: TipoPago
  efectivo: number
  debito: number
}

/**
 * Construye el arreglo de pagos a persistir.
 *
 * Precondición:
 * - Los montos ya fueron validados por cobro.logic
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
        { tipo: 'EFECTIVO', monto: totalCobrado },
      ]

    case 'DEBITO':
      return [
        { tipo: 'DEBITO', monto: totalCobrado },
      ]

    case 'CREDITO':
      return [
        { tipo: 'CREDITO', monto: totalCobrado },
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
        { tipo: 'EFECTIVO', monto: efectivo },
        { tipo: 'DEBITO', monto: debito },
      ]

    default:
      return []
  }
}