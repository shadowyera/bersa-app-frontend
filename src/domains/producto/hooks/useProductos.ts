import { useQuery } from '@tanstack/react-query'

import {
  getProductosPOS,
  getProductosAdmin,
} from '@/domains/producto/api/producto.api'

import { mapProductoFromApi } from '@/domains/producto/mappers/producto.mapper'
import type { Producto } from '../domain/producto.types'

import { productoKeys } from '../queries/producto.keys'

/**
 * Productos visibles en POS (solo activos)
 */
export function useProductosPOS() {
  return useQuery<Producto[]>({
    queryKey: productoKeys.pos(),

    queryFn: async () => {
      const data = await getProductosPOS()
      return data.map(mapProductoFromApi)
    },

    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Productos para Admin / Encargado (incluye inactivos)
 */
export function useProductosAdmin() {
  return useQuery<Producto[]>({
    queryKey: productoKeys.admin(),

    queryFn: async () => {
      const data = await getProductosAdmin()
      return data.map(mapProductoFromApi)
    },

    staleTime: 2 * 60 * 1000,
  })
}