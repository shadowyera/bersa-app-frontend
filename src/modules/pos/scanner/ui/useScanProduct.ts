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
 * Flujo:
 * 1️⃣ Busca en catálogo cacheado (ultra rápido)
 * 2️⃣ Si no lo encuentra → consulta API por código
 * 3️⃣ Valida existencia y estado
 */
export function useScanProduct() {

  const queryClient = useQueryClient()

  const scan = async (code: string): Promise<Producto> => {

    const codigo = code.trim()

    /* =====================================================
       1️⃣ Buscar en catálogo cacheado
    ===================================================== */

    const productosCatalogo =
      queryClient.getQueryData<Producto[]>(
        productoKeys.pos()
      )

    if (productosCatalogo) {

      const encontrado = productosCatalogo.find(
        p => p.codigo === codigo
      )

      if (encontrado) {

        if (!encontrado.activo) {
          throw new Error('INACTIVE')
        }

        return encontrado
      }
    }

    /* =====================================================
       2️⃣ Si no está en catálogo → buscar en API
    ===================================================== */

    const producto = await queryClient.fetchQuery<Producto>({
      queryKey: productoKeys.codigo(codigo),

      queryFn: async () => {

        const raw =
          await buscarProductoPorCodigo(codigo)

        if (!raw) {
          throw new Error('NOT_FOUND')
        }

        const mapped = mapProductoFromApi(raw)

        if (!mapped.activo) {
          throw new Error('INACTIVE')
        }

        return mapped
      },

      staleTime: 1000 * 60 * 5,
      retry: false,
    })

    return producto
  }

  return { scan }
}