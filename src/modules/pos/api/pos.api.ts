import { api } from '@/shared/api/api'

/* =====================================================
   Tipos POS
===================================================== */
import type { PagoPOS } from '../pos.types'
import type { Producto } from '@/shared/producto/producto.types'
import type { StockProducto } from '@/shared/types/stock.types'

/* =====================================================
   Ventas POS
===================================================== */

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

/**
 * Crea una venta desde el POS
 */
export async function crearVentaPOS(
  payload: CrearVentaPOSPayload
) {
  const { data } = await api.post('/ventas/pos', payload)
  return data
}

/* =====================================================
   Productos (POS)
===================================================== */

/**
 * Busca un producto por código de barras.
 *
 * - Retorna null si no existe
 * - Lanza error para otros casos
 */
export async function buscarProductoPorCodigo(
  codigo: string
): Promise<Producto | null> {
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

/* =====================================================
   Caja (POS-facing)
   ⚠️ Wrapper del dominio Caja
===================================================== */

export interface AperturaCajaDTO {
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

/**
 * Obtiene las cajas de la sucursal del usuario autenticado
 */
export async function getCajasBySucursal(): Promise<CajaDTO[]> {
  const { data } = await api.get('/cajas')
  return data
}

/**
 * Retorna la apertura activa de una caja (o null)
 */
export async function getAperturaActiva(
  cajaId: string
): Promise<AperturaCajaDTO | null> {
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
export async function abrirCaja(params: {
  cajaId: string
  montoInicial: number
}) {
  const { data } = await api.post(
    `/cajas/${params.cajaId}/abrir`,
    { montoInicial: params.montoInicial }
  )
  return data
}

/**
 * Cierra una caja automáticamente
 */
export async function cerrarCajaAutomatico(params: {
  cajaId: string
  montoFinal: number
}) {
  const { data } = await api.post(
    `/cajas/${params.cajaId}/cerrar-automatico`,
    { montoFinal: params.montoFinal }
  )
  return data
}

/**
 * Obtiene el resumen previo al cierre de caja
 */
export async function getResumenPrevioCaja(
  cajaId: string
) {
  const { data } = await api.get(
    `/cajas/${cajaId}/resumen-previo`
  )
  return data
}

/**
 * Obtiene el corte por cajero
 */
export async function getCorteCajeros(
  cajaId: string
) {
  const { data } = await api.get(
    `/cajas/${cajaId}/corte-cajeros`
  )
  return data
}

/* =====================================================
   Stock (POS convenience)
===================================================== */

/**
 * Obtiene stock por sucursal.
 *
 * ⚠️ No es POS-specific.
 * Se mantiene aquí SOLO como wrapper de conveniencia.
 */
export async function getStockBySucursal(
  sucursalId: string
): Promise<StockProducto[]> {
  const { data } = await api.get(
    `/stock/sucursal/${sucursalId}`
  )
  return data
}