import { api } from './api'
import type { StockProducto, Sucursal } from '@/shared/types/stock.types'

/* ================================
   Sucursales
================================ */

/**
 * Lista de sucursales
 * (usado en Admin Stock)
 */
export const getSucursales = async (): Promise<Sucursal[]> => {
  const { data } = await api.get('/sucursales')
  return data
}

/* ================================
   Stock
================================ */

/**
 * Stock por sucursal
 * (Admin y POS)
 */
export const getStockPorSucursal = async (
  sucursalId: string
): Promise<StockProducto[]> => {
  const { data } = await api.get(
    `/stock/sucursal/${sucursalId}`
  )
  return data
}

/**
 * Habilitar / deshabilitar stock de un producto en sucursal
 */
export const setStockHabilitado = async (
  stockId: string,
  habilitado: boolean
): Promise<void> => {
  await api.patch(`/stock/${stockId}/habilitado`, {
    habilitado,
  })
}