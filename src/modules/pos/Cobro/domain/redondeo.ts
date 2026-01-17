/**
 * Resultado del cálculo de redondeo
 */
export interface ResultadoRedondeo {
  /** Total original de la venta */
  totalOriginal: number

  /** Ajuste aplicado (positivo o negativo) */
  ajusteRedondeo: number

  /** Total final a cobrar */
  totalCobrado: number
}

/**
 * Regla oficial de redondeo CLP (Chile):
 *
 * - Se eliminan monedas de $1 y $5
 * - Pagos en efectivo se redondean
 *   al múltiplo de $10 más cercano
 *
 * ⚠️ NO usar Math.round
 * ⚠️ Regla legal, no matemática
 */
export function calcularRedondeoCLP(
  total: number
): ResultadoRedondeo {
  const resto = total % 10

  /**
   * Tabla explícita de ajuste por resto
   * (más legible y mantenible)
   */
  const AJUSTE_POR_RESTO: Record<
    number,
    number
  > = {
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

  const ajusteRedondeo =
    AJUSTE_POR_RESTO[resto] ?? 0

  const totalCobrado = total + ajusteRedondeo

  return {
    totalOriginal: total,
    ajusteRedondeo,
    totalCobrado,
  }
}