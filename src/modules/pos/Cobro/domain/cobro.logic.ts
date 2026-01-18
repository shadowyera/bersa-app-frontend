import type { TipoPago } from '../../pos.types'
import type { EstadoCobro } from './cobro.types'
import { calcularRedondeoCLP } from './redondeo'

interface CalcularEstadoCobroInput {
  totalVenta: number
  modo: TipoPago
  efectivo: number
  debito: number
}

/**
 * Calcula el estado financiero de un cobro.
 *
 * - Aplica redondeo legal CLP
 * - Calcula totales, vuelto y falta
 * - Determina si el cobro puede confirmarse
 *
 * Dominio puro (sin efectos secundarios)
 */
export function calcularEstadoCobro({
  totalVenta,
  modo,
  efectivo,
  debito,
}: CalcularEstadoCobroInput): EstadoCobro {
  /* ===============================
     Redondeo CLP
  =============================== */
  const {
    totalCobrado,
    ajusteRedondeo,
  } = calcularRedondeoCLP(totalVenta)

  /* ===============================
     Total pagado según modo
  =============================== */
  const totalPagado =
    modo === 'EFECTIVO'
      ? efectivo
      : modo === 'MIXTO'
      ? efectivo + debito
      : totalCobrado

  /* ===============================
     Diferencias
  =============================== */
  const vuelto = Math.max(
    0,
    totalPagado - totalCobrado
  )

  const falta = Math.max(
    0,
    totalCobrado - totalPagado
  )

  /* ===============================
     Regla de confirmación
  =============================== */
  const puedeConfirmar =
    modo === 'EFECTIVO'
      ? efectivo >= totalCobrado
      : modo === 'MIXTO'
      ? totalPagado === totalCobrado
      : true

  return {
    totalVenta,
    totalCobrado,
    ajusteRedondeo,
    totalPagado,
    vuelto,
    falta,
    puedeConfirmar,
  }
}