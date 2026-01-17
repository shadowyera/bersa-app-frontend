import { api } from './api'
import type { Categoria } from '../types/categoria.types'

export const getCategoriasPOS = async (): Promise<Categoria[]> => {
  const { data } = await api.get('/categorias')
  return data
}

// Admin (todas)
export const getCategoriasAdmin = async (): Promise<Categoria[]> => {
  const { data } = await api.get('/categorias', {
    params: { includeInactive: true },
  })
  return data
}

export const createCategoria = async (
    payload: Partial<Categoria>
): Promise<Categoria> => {
    const { data } = await api.post('/categorias', payload)
    return data
}

export const updateCategoria = async (
    id: string,
    payload: Partial<Categoria>
): Promise<Categoria> => {
    const { data } = await api.put(`/categorias/${id}`, payload)
    return data
}

export const setCategoriaActiva = async (
    id: string,
    activo: boolean
) => {
    await api.patch(`/categorias/${id}/activo`, { activo })
}