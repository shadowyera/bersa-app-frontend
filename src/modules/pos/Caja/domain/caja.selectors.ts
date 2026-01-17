import type { Caja, AperturaCaja } from './caja.types'

/* =====================================================
   UI MODELS
===================================================== */

/**
 * Modelo de caja para listados / selección
 */
export interface CajaUI {
  id: string
  nombre: string
  abierta: boolean
  fechaApertura?: string
}

/**
 * Modelo específico para la barra de caja activa
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
 * Selector para listado / selección de cajas
 * Usado en: SeleccionarCajaModal
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
 * Selector para la barra de caja activa
 * Usado en: BarraCajaActiva
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