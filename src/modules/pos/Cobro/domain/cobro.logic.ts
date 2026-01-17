import type { TipoPago } from '../../pos.types'
import type { EstadoCobro } from './cobro.types'
import { calcularRedondeoCLP } from './redondeo.ts'

interface CalcularEstadoCobroInput {
  /** Total original de la venta */
  totalVenta: number

  /** Modo de pago */
  modo: TipoPago

  /** Monto ingresado en efectivo */
  efectivo: number

  /** Monto ingresado en débito (solo MIXTO) */
  debito: number
}

/**
 * Calcula el estado financiero del cobro
 *
 * Regla base:
 * - Aplica redondeo CLP
 * - Calcula vuelto y falta
 * - Decide si se puede confirmar el cobro
 *
 * ❗ Dominio PURO
 */
export function calcularEstadoCobro({
  totalVenta,
  modo,
  efectivo,
  debito,
}: CalcularEstadoCobroInput): EstadoCobro {
  /* ===============================
     Redondeo legal
  =============================== */
  const {
    totalCobrado,
    ajusteRedondeo,
  } = calcularRedondeoCLP(totalVenta)

  /* ===============================
     Total pagado (según modo)
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
     Reglas de confirmación
     (idénticas a tu lógica original)
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