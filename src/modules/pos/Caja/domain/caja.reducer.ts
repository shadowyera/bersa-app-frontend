import type { Caja, AperturaCaja } from './caja.types'
import type { CajaState } from './caja.state'
import { initialCajaState } from './caja.state'

/* =====================================================
   Actions
===================================================== */

export type CajaAction =
  | { type: 'RESET' }
  | { type: 'SELECCIONAR_CAJA'; caja: Caja }
  | { type: 'SET_APERTURA_ACTIVA'; apertura: AperturaCaja | null }
  | { type: 'APERTURA_CAJA'; apertura: AperturaCaja }
  | { type: 'CIERRE_CAJA' }

/* =====================================================
   Reducer
===================================================== */

export function cajaReducer(
  state: CajaState,
  action: CajaAction
): CajaState {
  switch (action.type) {
    case 'RESET':
      return initialCajaState

    case 'SELECCIONAR_CAJA':
      return {
        ...state,
        cajaSeleccionada: action.caja,
        aperturaActiva: null,
      }

    case 'SET_APERTURA_ACTIVA':
      return {
        ...state,
        aperturaActiva: action.apertura,
      }

    case 'APERTURA_CAJA':
      return {
        ...state,
        aperturaActiva: action.apertura,
      }

    case 'CIERRE_CAJA':
      return {
        ...state,
        aperturaActiva: null,
        cajaSeleccionada: null,
      }

    default:
      return state
  }
}