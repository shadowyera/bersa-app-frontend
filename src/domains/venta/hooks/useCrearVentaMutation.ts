import { useMutation, useQueryClient } from '@tanstack/react-query'

import { crearVentaPOS } from '../api/venta.api'
import type {
  CrearVentaPOSPayload,
} from '../api/venta.api'

import { stockKeys } from '@/domains/stock/queries/stock.keys'
import { ventaKeys } from '@/domains/venta/queries/venta.keys'
import type { StockItem } from '@/domains/stock/domain/stock.types'

export function useCrearVentaMutation(
  sucursalId?: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CrearVentaPOSPayload) =>
      crearVentaPOS(payload),

    /* =====================================================
       OPTIMISTIC UPDATE
    ===================================================== */

    onMutate: async (payload) => {

      if (!sucursalId) return

      const stockQueryKey =
        stockKeys.sucursal(sucursalId)

      // 1️⃣ Cancelar refetch en curso
      await queryClient.cancelQueries({
        queryKey: stockQueryKey,
      })

      // 2️⃣ Snapshot previo
      const previousStock =
        queryClient.getQueryData<StockItem[]>(
          stockQueryKey
        )

      // 3️⃣ Optimistic stock update (nunca negativo)
      queryClient.setQueryData<StockItem[]>(
        stockQueryKey,
        (old) => {

          if (!old) return old

          return old.map(item => {

            const soldItem =
              payload.items.find(
                i => i.productoId === item.productoId
              )

            if (!soldItem) return item

            const nuevaCantidad =
              item.cantidad - soldItem.cantidad

            return {
              ...item,
              cantidad:
                nuevaCantidad < 0
                  ? 0
                  : nuevaCantidad,
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
      // Todo el dominio venta
      queryClient.invalidateQueries({
        queryKey: ventaKeys.all,
        exact: false,
      })
    },

    onSettled: () => {

      if (!sucursalId) return

      // Confirmación backend stock
      queryClient.invalidateQueries({
        queryKey: stockKeys.sucursal(sucursalId),
        exact: false,
      })
    },
  })
}