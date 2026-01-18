import { useMemo } from 'react'
import { useCaja } from '../context/CajaProvider'
import { buildBarraCajaUI } from '../domain/caja.selectors'

/**
 * Hook de lectura para la barra de caja activa.
 *
 * - Compone datos de caja + apertura
 * - Devuelve un objeto listo para UI
 * - No contiene lógica de render
 */
export function useCajaBarra() {
  const {
    cajaSeleccionada,
    aperturaActiva,
  } = useCaja()

  return useMemo(
    () =>
      buildBarraCajaUI(
        cajaSeleccionada,
        aperturaActiva
      ),
    [cajaSeleccionada, aperturaActiva]
  )
}