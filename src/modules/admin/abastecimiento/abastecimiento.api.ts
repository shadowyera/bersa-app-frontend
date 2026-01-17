import { api } from '@/shared/api/api'

interface RegistrarMovimientoInput {
  tipoMovimiento: 'INGRESO' | 'EGRESO'
  subtipoMovimiento:
    | 'COMPRA_PROVEEDOR'
    | 'TRANSFERENCIA_ENVIO'
    | 'TRANSFERENCIA_RECEPCION'
  productoId: string
  sucursalId: string
  cantidad: number
  observacion?: string
  referencia?: {
    tipo: 'COMPRA' | 'TRANSFERENCIA'
  }
}

export const registrarMovimientoStock = async (
  input: RegistrarMovimientoInput
) => {
  const { data } = await api.post('/movimientos', input)
  return data
}

export const getMovimientosSucursal = async (
  sucursalId: string,
  page = 1,
  limit = 10
) => {
  const { data } = await api.get(
    `/movimientos/sucursal/${sucursalId}?page=${page}&limit=${limit}`
  )
  return data
}