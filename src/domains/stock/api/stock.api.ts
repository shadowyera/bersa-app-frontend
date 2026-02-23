// src/domains/stock/api/stock.api.ts

import { api } from '@/shared/api/api'
import type { StockItem } from '../domain/stock.types'

export async function obtenerStockSucursal(
  sucursalId: string
): Promise<StockItem[]> {
  const { data } = await api.get(
    `/stock/sucursal/${sucursalId}`
  )

  return data
}