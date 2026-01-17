import { useMemo } from 'react'
import { useCaja } from '../context/CajaProvider'
import { buildBarraCajaUI } from '../domain/caja.selectors'

export function useCajaBarra() {
  const { cajaSeleccionada, aperturaActiva } = useCaja()

  return useMemo(
    () =>
      buildBarraCajaUI(
        cajaSeleccionada,
        aperturaActiva
      ),
    [cajaSeleccionada, aperturaActiva]
  )
}