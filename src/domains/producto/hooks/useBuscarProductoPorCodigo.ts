import { useQuery } from '@tanstack/react-query'

import { buscarProductoPorCodigo } from '../api/producto.api'
import { mapProductoFromApi } from '../mappers/producto.mapper'
import type { Producto } from '../domain/producto.types'

import { productoKeys } from '../queries/producto.keys'

export function useBuscarProductoPorCodigo(
  codigo?: string
) {

  const query = useQuery<Producto | null>({
    queryKey: codigo
      ? productoKeys.codigo(codigo)
      : productoKeys.all,

    queryFn: async () => {
      if (!codigo) return null

      const raw =
        await buscarProductoPorCodigo(codigo)

      if (!raw) return null

      return mapProductoFromApi(raw)
    },

    enabled: Boolean(codigo),
    staleTime: 1000 * 60 * 5,
  })

  return {
    producto: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}