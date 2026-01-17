import { api } from './api'

export interface Sucursal {
  _id: string
  nombre: string
  modoAjusteInventario: boolean
}

export const getSucursales = async (): Promise<Sucursal[]> => {
  const { data } = await api.get('/sucursales')
  return data
}

export const getSucursalById = async (
  id: string
): Promise<Sucursal> => {
  const { data } = await api.get(`/sucursales/${id}`)
  return data
}