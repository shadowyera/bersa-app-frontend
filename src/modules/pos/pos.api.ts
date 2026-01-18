import { api } from '@/shared/api/api'
import type { PagoPOS } from './pos.types'
import type { Producto } from '@/shared/types/producto.types'
import type { StockProducto } from '@/shared/types/stock.types'

/* ================================
   Tipos POS
================================ */

/**
 * Payload para crear una venta desde el POS
 */
export interface CrearVentaPOSPayload {
  cajaId: string
  aperturaCajaId: string
  items: {
    productoId: string
    cantidad: number
    precioUnitario: number
  }[]
  pagos: PagoPOS[]

  // Ajuste por redondeo de efectivo (CLP)
  ajusteRedondeo: number
}

export interface AperturaCaja {
  _id: string
  cajaId: string
  createdAt: string
}

export interface CajaDTO {
  _id: string
  nombre: string
  abierta: boolean
  apertura: {
    usuario: {
      nombre: string
    }
    fechaApertura: string
    montoInicial: number
  } | null
}

/* ================================
   Productos (POS)
================================ */

/**
 * Busca un producto por código de barras.
 *
 * - Retorna null si no existe
 * - Lanza error para otros casos
 */
export const buscarProductoPorCodigo = async (
  codigo: string
): Promise<Producto | null> => {
  try {
    const { data } = await api.get(
      `/productos/buscar/${encodeURIComponent(codigo)}`
    )
    return data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

/* ================================
   Cajas
================================ */

/**
 * Obtiene cajas de la sucursal del usuario autenticado
 */
export const getCajasBySucursal = async (): Promise<CajaDTO[]> => {
  const { data } = await api.get('/cajas')
  return data
}

/**
 * Retorna la apertura activa de una caja (o null)
 */
export const getAperturaActiva = async (
  cajaId: string
): Promise<AperturaCaja | null> => {
  try {
    const { data } = await api.get(
      `/cajas/${cajaId}/apertura-activa`
    )
    return data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Abre una caja con monto inicial
 */
export const abrirCaja = async (
  cajaId: string,
  montoInicial: number
) => {
  const { data } = await api.post(
    `/cajas/${cajaId}/abrir`,
    { montoInicial }
  )
  return data
}

/**
 * Cierra una caja automáticamente
 */
export const cerrarCajaAutomatico = async (
  cajaId: string,
  montoFinal: number
) => {
  const { data } = await api.post(
    `/cajas/${cajaId}/cerrar-automatico`,
    { montoFinal }
  )
  return data
}

/**
 * Obtiene el resumen previo al cierre de caja
 */
export const getResumenPrevioCaja = async (
  cajaId: string
) => {
  const { data } = await api.get(
    `/cajas/${cajaId}/resumen-previo`
  )
  return data
}

/**
 * Obtiene el corte por cajero
 */
export const getCorteCajeros = async (
  cajaId: string
) => {
  const { data } = await api.get(
    `/cajas/${cajaId}/corte-cajeros`
  )
  return data
}

/* ================================
   Ventas POS
================================ */

/**
 * Crea una venta desde el POS
 */
export const crearVentaPOS = async (
  payload: CrearVentaPOSPayload
) => {
  const { data } = await api.post(
    '/ventas/pos',
    payload
  )
  return data
}

/* ================================
   Stock (reexport)
================================ */

/**
 * Obtiene stock por sucursal.
 * No es POS-specific, se reexporta por conveniencia.
 */
export const getStockBySucursal = async (
  sucursalId: string
): Promise<StockProducto[]> => {
  const { data } = await api.get(
    `/stock/sucursal/${sucursalId}`
  )
  return data
}