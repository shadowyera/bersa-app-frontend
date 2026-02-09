import type { PagoPOS, TipoPago } from '../../domain/pos.types'

/* =====================================================
   Input
===================================================== */

interface BuildPagosInput {
  /**
   * Total final cobrado (post redondeo)
   */
  totalCobrado: number

  /**
   * Modo principal de pago
   */
  modo: TipoPago

  /**
   * Monto efectivo entregado
   * (solo relevante en EFECTIVO / MIXTO)
   */
  efectivo: number

  /**
   * Monto pagado con débito
   * (solo relevante en MIXTO)
   */
  debito: number
}

/* =====================================================
   Helpers internos
===================================================== */

/**
 * Normaliza montos para evitar
 * negativos, NaN o undefined.
 */
function normalizarMonto(valor: number): number {
  if (!valor || Number.isNaN(valor)) return 0
  return Math.max(0, valor)
}

/* =====================================================
   Factory
===================================================== */

/**
 * Construye el arreglo de pagos a persistir.
 *
 * Reglas:
 * - Los montos ya vienen validados desde cobro.logic
 * - Nunca genera pagos con monto 0
 * - No retorna arrays vacíos para modos válidos
 *
 * Dominio puro.
 */
export function buildPagos({
  totalCobrado,
  modo,
  efectivo,
  debito,
}: BuildPagosInput): PagoPOS[] {
  const efectivoSeguro = normalizarMonto(efectivo)
  const debitoSeguro = normalizarMonto(debito)

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

    case 'MIXTO': {
      const pagos: PagoPOS[] = []

      if (efectivoSeguro > 0) {
        pagos.push({
          tipo: 'EFECTIVO',
          monto: efectivoSeguro,
        })
      }

      if (debitoSeguro > 0) {
        pagos.push({
          tipo: 'DEBITO',
          monto: debitoSeguro,
        })
      }

      return pagos
    }

    /**
     * Si llegara un modo desconocido
     * preferimos fallar de forma segura.
     */
    default:
      throw new Error(
        `Modo de pago no soportado: ${modo}`
      )
  }
}