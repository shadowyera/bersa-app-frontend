import { api } from '@/shared/api/api'
import type {
  CrearFacturaInput,
  Factura,
} from '../domain/factura.types'

export async function apiCrearFactura(
  input: CrearFacturaInput
): Promise<Factura> {

  const { data } =
    await api.post('/facturas', input)

  return data
}

export async function apiObtenerFacturasPorVenta(
  ventaId: string
): Promise<Factura[]> {

  const { data } =
    await api.get(
      `/ventas/${ventaId}/facturas`
    )

  return data
}