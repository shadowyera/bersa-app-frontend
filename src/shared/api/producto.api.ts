import { api } from "./api"
import type {
  Producto,
  CreateProductoDTO,
  UpdateProductoDTO,
} from '../types/producto.types'

// POS (solo activos)
export const getProductosPOS = async (): Promise<Producto[]> => {
  const { data } = await api.get('/productos')
  return data
}

// Admin / Encargado (incluye inactivos)
export const getProductosAdmin = async (): Promise<Producto[]> => {
  const { data } = await api.get('/productos', {
    params: { includeInactive: true },
  })
  return data
}

export const createProducto = async (
  payload: CreateProductoDTO
): Promise<Producto> => {
  const { data } = await api.post('/productos', payload)
  return data
}

export const updateProducto = async (
  id: string,
  payload: UpdateProductoDTO
): Promise<Producto> => {
  const { data } = await api.put(`/productos/${id}`, payload)
  return data
}

export const setProductoActivo = async (
  id: string,
  activo: boolean
): Promise<void> => {
  await api.patch(`/productos/${id}/activo`, { activo })
}