import { api } from './api'
import type { Proveedor } from '@/shared/types/proveedor.types'

/* ================================
   Queries
================================ */

export const getProveedores = async (params?: {
  includeInactive?: boolean
}): Promise<Proveedor[]> => {
  const { data } = await api.get('/proveedores', { params })
  return data
}

/* ================================
   Mutations
================================ */

export const createProveedor = async (
  payload: { nombre: string }
): Promise<Proveedor> => {
  const { data } = await api.post('/proveedores', payload)
  return data
}

export const updateProveedor = async (
  id: string,
  payload: { nombre?: string }
): Promise<Proveedor> => {
  const { data } = await api.put(`/proveedores/${id}`, payload)
  return data
}

export const setProveedorActivo = async (
  id: string,
  activo: boolean
): Promise<void> => {
  await api.patch(`/proveedores/${id}/activo`, { activo })
}