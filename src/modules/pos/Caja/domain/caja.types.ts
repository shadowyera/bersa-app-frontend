/* =====================================================
   Estados (alineados EXACTO a backend)
===================================================== */

/**
 * Estado de la apertura de caja (turno)
 * Coincide con ESTADO_APERTURA_CAJA del backend
 */
export const ESTADO_APERTURA_CAJA = {
  ABIERTA: 'ABIERTA',
  CERRADA: 'CERRADA',
} as const

export type EstadoAperturaCaja =
  typeof ESTADO_APERTURA_CAJA[keyof typeof ESTADO_APERTURA_CAJA]

/* =====================================================
   Modelos base
===================================================== */

/**
 * Caja física del sistema
 * NO pertenece a un usuario
 */
export interface Caja {
  id: string
  nombre: string
  sucursalId: string
  activa: boolean
}

/**
 * Apertura de caja (turno)
 * Puede ser abierta por un usuario y cerrada por otro
 */
export interface AperturaCaja {
  id: string

  cajaId: string
  sucursalId: string

  usuarioAperturaId: string
  usuarioCierreId?: string

  fechaApertura: string
  montoInicial: number

  fechaCierre?: string
  montoFinal?: number
  diferencia?: number

  estado: EstadoAperturaCaja
}