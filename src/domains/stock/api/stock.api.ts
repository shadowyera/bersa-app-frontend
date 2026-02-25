import { api } from '@/shared/api/api'
import type {
  StockItem,
  AdminStockItem,
} from '../domain/stock.types'

/* =====================================================
   POS
===================================================== */

export async function obtenerStockSucursal(
  sucursalId: string
): Promise<StockItem[]> {
  const { data } = await api.get(
    `/stock/sucursal/${sucursalId}`
  )

  return data
}

/* =====================================================
   ADMIN
===================================================== */

export async function obtenerStockAdmin(
  sucursalId: string
): Promise<AdminStockItem[]> {
  const { data } = await api.get(
    `/admin/stock`,
    {
      params: { sucursalId },
    }
  )

  return data
}

export async function updateStockHabilitado(
  stockId: string,
  habilitado: boolean
): Promise<void> {
  await api.put(
    `/stock/${stockId}/habilitado`,
    { habilitado }
  )
}