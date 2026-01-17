import { api } from '@/shared/api/api'
import type { PagoPOS } from './pos.types'
import type { Producto } from '@/shared/types/producto.types'
import type { StockProducto } from '@/shared/types/stock.types'

/* ================================
   Tipos POS
================================ */

export interface CrearVentaPOSPayload {
  cajaId: string
  aperturaCajaId: string
  items: {
    productoId: string
    cantidad: number
    precioUnitario: number
  }[]
  pagos: PagoPOS[]

  /** 🔥 Redondeo de efectivo */
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
   Productos (POS-specific)
================================ */

/**
 * 🔎 Buscar producto por código de barras
 * Endpoint específico de POS
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

export const getCajasBySucursal = async (): Promise<CajaDTO[]> => {
  const { data } = await api.get('/cajas') // sucursal desde JWT
  return data
}

export const getAperturaActiva = async (
  cajaId: string
): Promise<AperturaCaja | null> => {
  try {
    const { data } = await api.get(`/cajas/${cajaId}/apertura-activa`)
    return data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export const abrirCaja = async (
  cajaId: string,
  montoInicial: number
) => {
  const { data } = await api.post(`/cajas/${cajaId}/abrir`, {
    montoInicial,
  })
  return data
}

export const cerrarCajaAutomatico = async (
  cajaId: string,
  montoFinal: number
) => {
  const { data } = await api.post(`/cajas/${cajaId}/cerrar-automatico`, {
    montoFinal,
  })
  return data
}

export const getResumenPrevioCaja = async (cajaId: string) => {
  const { data } = await api.get(`/cajas/${cajaId}/resumen-previo`)
  return data
}

export const getCorteCajeros = async (cajaId: string) => {
  const { data } = await api.get(`/cajas/${cajaId}/corte-cajeros`)
  return data
}

/* ================================
   Ventas POS
================================ */

export const crearVentaPOS = async (
  payload: CrearVentaPOSPayload
) => {
  const { data } = await api.post('/ventas/pos', payload)
  return data
}

/* ================================
   Stock (reexport shared)
================================ */

/**
 * ⚠️ Este endpoint NO es POS-specific,
 * se reexporta para comodidad
 */
export const getStockBySucursal = async (
  sucursalId: string
): Promise<StockProducto[]> => {
  const { data } = await api.get(`/stock/sucursal/${sucursalId}`)
  return data
}