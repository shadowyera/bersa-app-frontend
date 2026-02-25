import { useMutation, useQueryClient } from '@tanstack/react-query'

import { anularVentaPOSApi } from '../api/venta.api'

import { stockKeys } from '@/domains/stock/queries/stock.keys'
import { ventaKeys } from '@/domains/venta/queries/venta.keys'
import { cajaKeys } from '@/domains/caja/queries/caja.keys'

import type { StockItem } from '@/domains/stock/domain/stock.types'

/* =====================================================
   Tipos
===================================================== */

interface AnularVentaPayload {
  ventaId: string
  items: {
    productoId: string
    cantidad: number
  }[]
}

interface AnularVentaContext {
  previousStock?: StockItem[]
}

/* =====================================================
   Hook
===================================================== */

export function useAnularVentaMutation(
  sucursalId?: string,
  cajaId?: string
) {
  const queryClient = useQueryClient()

  return useMutation<
    unknown,
    Error,
    AnularVentaPayload,
    AnularVentaContext
  >({
    mutationFn: (payload) =>
      anularVentaPOSApi(payload.ventaId),

    /* =====================================================
       OPTIMISTIC STOCK
    ===================================================== */

    onMutate: async (payload) => {

      if (!sucursalId) {
        return {}
      }

      const stockQueryKey =
        stockKeys.sucursal(sucursalId)

      await queryClient.cancelQueries({
        queryKey: stockQueryKey,
      })

      const previousStock =
        queryClient.getQueryData<StockItem[]>(
          stockQueryKey
        )

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

    onError: (_e, _p, ctx) => {

      if (!sucursalId) return

      if (ctx?.previousStock) {
        queryClient.setQueryData(
          stockKeys.sucursal(sucursalId),
          ctx.previousStock
        )
      }
    },

    /* =====================================================
       SUCCESS
    ===================================================== */

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ventaKeys.all,
        exact: false,
      })

      if (cajaId) {
        queryClient.invalidateQueries({
          queryKey: cajaKeys.resumenPrevio(cajaId),
        })
      }
    },

    /* =====================================================
       SETTLED
    ===================================================== */

    onSettled: () => {

      if (!sucursalId) return

      // 🔥 Invalida TODO el dominio stock
      queryClient.invalidateQueries({
        queryKey: stockKeys.all,
      })
    },
  })
}