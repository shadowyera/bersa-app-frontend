import { useMemo } from 'react'
import { useCaja } from '../context/CajaProvider'

/* =====================================================
   Tipos UI
===================================================== */

export interface BarraCajaUI {
  visible: boolean
  nombreCaja: string
  horaApertura: string
  cajaId: string
  aperturaId: string
}

/* =====================================================
   Hook
===================================================== */

/**
 * Hook de lectura para la barra de caja activa.
 *
 * RESPONSABILIDAD:
 * - Leer estado desde CajaProvider
 * - Componer un modelo listo para UI
 *
 * NO:
 * - No usa SSE
 * - No usa API
 * - No maneja estado
 */
export function useCajaBarra(): BarraCajaUI {
  const {
    cajaSeleccionada,
    aperturaActiva,
  } = useCaja()

  return useMemo(() => {
    if (!cajaSeleccionada || !aperturaActiva) {
      return {
        visible: false,
        nombreCaja: '',
        horaApertura: '',
        cajaId: '',
        aperturaId: '',
      }
    }

    return {
      visible: true,
      nombreCaja: cajaSeleccionada.nombre,
      horaApertura: new Date(
        aperturaActiva.fechaApertura
      ).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      cajaId: cajaSeleccionada.id,
      aperturaId: aperturaActiva.id,
    }
  }, [cajaSeleccionada, aperturaActiva])
}