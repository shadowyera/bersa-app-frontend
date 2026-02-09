/* =====================================================
   Tipos
===================================================== */

/**
 * Resultado del cálculo de redondeo CLP.
 */
export interface ResultadoRedondeo {
  /**
   * Total original de la venta
   * (antes de aplicar redondeo)
   */
  totalOriginal: number

  /**
   * Ajuste aplicado por redondeo.
   * Puede ser positivo o negativo.
   */
  ajusteRedondeo: number

  /**
   * Total final a cobrar
   * (totalOriginal + ajusteRedondeo)
   */
  totalCobrado: number
}

/* =====================================================
   Helpers internos
===================================================== */

/**
 * Normaliza montos para evitar
 * NaN, undefined o negativos.
 */
function normalizarTotal(total: number): number {
  if (!total || Number.isNaN(total)) return 0
  return Math.max(0, total)
}

/**
 * Tabla oficial de ajuste por resto.
 *
 * Regla chilena:
 * - Se eliminan monedas de $1 y $5
 * - Se redondea al múltiplo de $10 más cercano
 */
const AJUSTE_POR_RESTO: Record<number, number> =
  {
    0: 0,
    1: -1,
    2: -2,
    3: 2,
    4: 1,
    5: 0,
    6: -1,
    7: -2,
    8: 2,
    9: 1,
  }

/* =====================================================
   Dominio principal
===================================================== */

/**
 * Calcula el redondeo legal CLP.
 *
 * ⚠️ NO usar Math.round
 * ⚠️ Regla legal, no matemática
 *
 * Características:
 * - Función pura
 * - Sin efectos secundarios
 * - Determinística
 */
export function calcularRedondeoCLP(
  total: number
): ResultadoRedondeo {
  /* -----------------------------
     Normalización defensiva
  ----------------------------- */
  const totalSeguro = normalizarTotal(total)

  /* -----------------------------
     Resto respecto a 10
  ----------------------------- */
  const resto = totalSeguro % 10

  /* -----------------------------
     Ajuste
  ----------------------------- */
  const ajusteRedondeo =
    AJUSTE_POR_RESTO[resto] ?? 0

  /* -----------------------------
     Total final
  ----------------------------- */
  const totalCobrado =
    totalSeguro + ajusteRedondeo

  /* -----------------------------
     Resultado
  ----------------------------- */
  return {
    totalOriginal: totalSeguro,
    ajusteRedondeo,
    totalCobrado,
  }
}