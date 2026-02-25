import { useQueryClient } from '@tanstack/react-query'

import { buscarProductoPorCodigo } 
  from '@/domains/producto/api/producto.api'

import { mapProductoFromApi } 
  from '@/domains/producto/mappers/producto.mapper'

import { productoKeys } 
  from '@/domains/producto/queries/producto.keys'

import type { Producto } 
  from '@/domains/producto/domain/producto.types'

/**
 * Hook para procesar un código escaneado.
 *
 * - Busca el producto por código
 * - Usa cache de React Query
 * - Valida que exista y esté activo
 * - Lanza errores semánticos para la UI
 */
export function useScanProduct() {

  const queryClient = useQueryClient()

  const scan = async (code: string): Promise<Producto> => {

    const producto = await queryClient.fetchQuery({
      queryKey: productoKeys.codigo(code),

      queryFn: async () => {

        const raw =
          await buscarProductoPorCodigo(code)

        if (!raw) return null

        return mapProductoFromApi(raw)
      },

      staleTime: 1000 * 60 * 5,
    })

    if (!producto) {
      throw new Error('NOT_FOUND')
    }

    if (!producto.activo) {
      throw new Error('INACTIVE')
    }

    return producto
  }

  return { scan }
}