import { api } from '@/shared/api/api'

/* =========================================
   POS
========================================= */

export interface StockSucursalDTO {
  productoId: string
  cantidad: number
}

export async function obtenerStockSucursal(
  sucursalId: string
): Promise<StockSucursalDTO[]> {

  const { data } = await api.get<StockSucursalDTO[]>(
    `/stock/sucursal/${sucursalId}`
  )

  return data
}

/* =========================================
   ADMIN
========================================= */

export async function obtenerStockAdmin(
  sucursalId: string
) {
  const { data } = await api.get(
    '/admin/stock',
    { params: { sucursalId } }
  )

  return data
}

export async function ajustarStockAdmin(
  stockId: string,
  cantidad: number,
  motivo: string
) {
  const { data } = await api.post(
    `/admin/stock/${stockId}/ajuste`,
    { cantidad, motivo }
  )

  return data
}

export async function toggleStockHabilitado(
  stockId: string,
  habilitado: boolean
) {
  const { data } = await api.put(
    `/stock/${stockId}/habilitado`,
    { habilitado }
  )

  return data
}