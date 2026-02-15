import type { Caja, AperturaCaja } from './caja.types'

/* =====================================================
   Estado del dominio Caja (POS)
===================================================== */

/**
 * Estado local del operador POS.
 *
 * ⚠️ Importante:
 * - NO es snapshot global
 * - NO duplica React Query
 * - NO conoce SSE
 */
export interface CajaState {
  /**
   * Caja actualmente seleccionada por el operador
   */
  cajaSeleccionada: Caja | null

  /**
   * Apertura activa de la caja seleccionada
   * - null => caja cerrada
   */
  aperturaActiva: AperturaCaja | null
}

/* =====================================================
   Estado inicial
===================================================== */

export const initialCajaState: CajaState = {
  cajaSeleccionada: null,
  aperturaActiva: null,
}