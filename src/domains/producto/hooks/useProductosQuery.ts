import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  getProductosPOS,
  getProductosAdmin,
  type ListarProductosParams,
} from '@/domains/producto/api/producto.api'

import { mapProductoFromApi } from '@/domains/producto/mappers/producto.mapper'
import type { Producto } from '../domain/producto.types'

import { productoKeys } from '../queries/producto.keys'

/* =====================================================
   POS (catálogo completo activos)
===================================================== */

export function useProductosPOSQuery() {
  return useQuery<Producto[]>({
    queryKey: productoKeys.pos(),
    queryFn: async () => {
      const data = await getProductosPOS()
      return data.map(mapProductoFromApi)
    },
    staleTime: 5 * 60 * 1000,
  })
}

/* =====================================================
   ADMIN (paginado backend)
===================================================== */

interface ProductosAdminQueryResult {
  data: Producto[]
  page: number
  total: number
  totalPages: number
}

export function useProductosAdminQuery(
  params: ListarProductosParams
) {
  return useQuery<ProductosAdminQueryResult>({
    queryKey: productoKeys.admin(params),

    queryFn: async () => {
      const response = await getProductosAdmin(params)

      return {
        data: response.data.map(mapProductoFromApi),
        page: response.page,
        total: response.total,
        totalPages: response.totalPages,
      }
    },

    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  })
}