import { useMutation, useQueryClient } from '@tanstack/react-query'

import { anularVentaPOSApi } from '../api/venta.api'

import { stockKeys } from '@/domains/stock/queries/stock.keys'
import { ventaKeys } from '@/domains/venta/queries/venta.keys'
import type { StockItem } from '@/domains/stock/domain/stock.types'

interface AnularVentaPayload {
  ventaId: string
  items: {
    productoId: string
    cantidad: number
  }[]
}

export function useAnularVentaMutation(
  sucursalId?: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AnularVentaPayload) =>
      anularVentaPOSApi(payload.ventaId),

    /* =====================================================
       OPTIMISTIC UPDATE
    ===================================================== */

    onMutate: async (payload) => {

      if (!sucursalId) return

      const stockQueryKey =
        stockKeys.sucursal(sucursalId)

      await queryClient.cancelQueries({
        queryKey: stockQueryKey,
      })

      const previousStock =
        queryClient.getQueryData<StockItem[]>(
          stockQueryKey
        )

      // Sumar stock devuelto
      queryClient.setQueryData<StockItem[]>(
        stockQueryKey,
        (old) => {

          if (!old) return old

          return old.map(item => {

            const returned =
              payload.items.find(
                i => i.productoId === item.productoId
              )

            if (!returned) return item

            return {
              ...item,
              cantidad:
                item.cantidad + returned.cantidad,
            }
          })
        }
      )

      return { previousStock }
    },

    /* =====================================================
       ROLLBACK
    ===================================================== */

    onError: (_err, _payload, context) => {

      if (!sucursalId) return

      if (context?.previousStock) {
        queryClient.setQueryData(
          stockKeys.sucursal(sucursalId),
          context.previousStock
        )
      }
    },

    /* =====================================================
       INVALIDACIONES
    ===================================================== */

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ventaKeys.all,
        exact: false,
      })
    },

    onSettled: () => {

      if (!sucursalId) return

      queryClient.invalidateQueries({
        queryKey: stockKeys.sucursal(sucursalId),
        exact: false,
      })
    },
  })
}