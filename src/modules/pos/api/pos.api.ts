import { api } from '@/shared/api/api'

/* =====================================================
   Tipos POS
===================================================== */

import type { PagoPOS } from '../domain/pos.types'
import type { Producto } from '@/shared/producto/producto.types'
import type { StockProducto } from '@/shared/types/stock.types'
import type {
  VentaDetalle,
  DocumentoTributario,
} from '../venta/domain/venta.types'

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

  documentoTributario: DocumentoTributario
}

/**
 * Crea una venta desde el POS
 */
export async function crearVentaPOS(
  payload: CrearVentaPOSPayload
) {
  const { data } = await api.post(
    '/ventas',
    payload
  )
  return data
}

/**
 * Anula una venta POS
 */
export async function anularVentaPOSApi(
  ventaId: string
) {
  const { data } = await api.post(
    `/ventas/${ventaId}/anular`
  )
  return data
}

/**
 * Obtiene el detalle completo de una venta
 * (items + pagos)
 */
export async function getVentaDetalle(
  ventaId: string
): Promise<VentaDetalle> {
  const { data } = await api.get(
    `/ventas/${ventaId}/detalle`
  )
  return data
}

/* =====================================================
   Ventas por Apertura (Resumen de Caja)
===================================================== */

/**
 * Obtiene todas las ventas del turno activo
 * de una caja
 */
export async function getVentasApertura(
  cajaId: string
) {
  const { data } = await api.get(
    `/cajas/${cajaId}/ventas-apertura`
  )
  return data
}

/* =====================================================
   Productos (POS)
===================================================== */

/**
 * Busca un producto por código de barras.
 */
export async function buscarProductoPorCodigo(
  codigo: string
): Promise<Producto | null> {
  try {
    const { data } = await api.get(
      `/productos/buscar/${encodeURIComponent(
        codigo
      )}`
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
export async function getCajasBySucursal(): Promise<
  CajaDTO[]
> {
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
 */
export async function getStockBySucursal(
  sucursalId: string
): Promise<StockProducto[]> {
  const { data } = await api.get(
    `/stock/sucursal/${sucursalId}`
  )
  return data
}