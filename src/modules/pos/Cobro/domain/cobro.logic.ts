import type { TipoPago } from '../../domain/pos.types'
import type { EstadoCobro } from './cobro.types'

/* =====================================================
   Helpers
===================================================== */

/**
 * Redondeo CLP legal:
 * siempre hacia arriba al múltiplo de 10.
 * SOLO para efectivo puro.
 */
function calcularRedondeoCLP(base: number): number {
  const resto = base % 10
  if (resto === 0) return 0
  return 10 - resto
}

/**
 * Normaliza montos para evitar NaN o negativos
 */
function normalizarMonto(valor: number): number {
  if (!Number.isFinite(valor)) return 0
  return Math.max(0, valor)
}

/* =====================================================
   Dominio Cobro
===================================================== */

interface Input {
  totalVenta: number
  modo: TipoPago
  efectivo: number
  debito: number
}

/**
 * Calcula el estado financiero del cobro.
 */
export function calcularEstadoCobro({
  totalVenta,
  modo,
  efectivo,
  debito,
}: Input): EstadoCobro {

  const efectivoSeguro = normalizarMonto(efectivo)
  const debitoSeguro = normalizarMonto(debito)

  /* -----------------------------
     TOTAL BASE
  ----------------------------- */

  const baseTotal = totalVenta

  /* -----------------------------
     REDONDEO (solo efectivo puro)
  ----------------------------- */

  const ajusteRedondeo =
    modo === 'EFECTIVO'
      ? calcularRedondeoCLP(baseTotal)
      : 0

  /* -----------------------------
     TOTAL A COBRAR
  ----------------------------- */

  const totalCobrado =
    modo === 'EFECTIVO'
      ? baseTotal + ajusteRedondeo
      : baseTotal

  /* -----------------------------
     TOTAL PAGADO
  ----------------------------- */

  const totalPagado =
    modo === 'EFECTIVO'
      ? efectivoSeguro
      : modo === 'MIXTO'
        ? efectivoSeguro + debitoSeguro
        : totalCobrado

  /* -----------------------------
     DIFERENCIAS
  ----------------------------- */

  const vuelto = Math.max(
    0,
    totalPagado - totalCobrado
  )

  const falta = Math.max(
    0,
    totalCobrado - totalPagado
  )

  /* -----------------------------
     VALIDACIÓN
  ----------------------------- */

  const puedeConfirmar =
    modo === 'EFECTIVO'
      ? efectivoSeguro >= totalCobrado
      : modo === 'MIXTO'
        ? totalPagado >= totalCobrado
        : true

  /* -----------------------------
     RESULTADO
  ----------------------------- */

  return {
    modo,
    totalVenta: baseTotal,
    ajusteRedondeo,
    totalCobrado,
    totalPagado,
    vuelto,
    falta,
    puedeConfirmar,
  }
}
