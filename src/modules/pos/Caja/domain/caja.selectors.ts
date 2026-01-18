import type { Caja, AperturaCaja } from './caja.types'

/* =====================================================
   UI MODELS
===================================================== */

/**
 * Modelo de caja para listados y selección.
 */
export interface CajaUI {
  id: string
  nombre: string
  abierta: boolean
  fechaApertura?: string
}

/**
 * Modelo para la barra de caja activa.
 */
export interface BarraCajaUI {
  visible: boolean
  nombreCaja: string
  horaApertura: string
  cajaId: string
  aperturaId: string
}

/* =====================================================
   SELECTORS
===================================================== */

/**
 * Mapea una caja de dominio a un modelo UI
 * para listados / selección.
 */
export function mapCajaToUI(
  caja: Caja,
  apertura: AperturaCaja | null
): CajaUI {
  return {
    id: caja.id,
    nombre: caja.nombre,
    abierta: Boolean(apertura),
    fechaApertura: apertura?.fechaApertura,
  }
}

/**
 * Construye el modelo UI para la barra
 * de caja activa.
 */
export function buildBarraCajaUI(
  caja: Caja | null,
  apertura: AperturaCaja | null
): BarraCajaUI {
  if (!caja || !apertura) {
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
    nombreCaja: caja.nombre,
    horaApertura: new Date(
      apertura.fechaApertura
    ).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    cajaId: caja.id,
    aperturaId: apertura.id,
  }
}