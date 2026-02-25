import { useMutation, useQueryClient } from '@tanstack/react-query'

import { crearVentaPOS } from '../api/venta.api'
import type { CrearVentaPOSPayload } from '../api/venta.api'

import { stockKeys } from '@/domains/stock/queries/stock.keys'
import { ventaKeys } from '@/domains/venta/queries/venta.keys'
import { cajaKeys } from '@/domains/caja/queries/caja.keys'

import type { StockItem } from '@/domains/stock/domain/stock.types'

import type {
  VentaDetalle,
  VentaApertura,
} from '@/domains/venta/domain/venta.types'

/* =====================================================
   Tipos
===================================================== */

interface CrearVentaContext {
  previousStock?: StockItem[]
}

interface CrearVentaOptions {
  sucursalId?: string
  cajaId?: string
}

/* =====================================================
   Mapper
===================================================== */

function mapVentaDetalleToApertura(
  venta: VentaDetalle
): VentaApertura {
  return {
    id: venta._id,
    ventaId: venta._id,
    numeroVenta: venta.numeroVenta,
    fecha: venta.createdAt,
    total: venta.total,
    estado: 'FINALIZADA',

    documentoTributario: {
      tipo: venta.documentoTributario.tipo,
    },

    items: venta.items.map(item => ({
      productoId: item.productoId,
      cantidad: item.cantidad,
    })),
  }
}

/* =====================================================
   Hook
===================================================== */

export function useCrearVentaMutation(
  options?: CrearVentaOptions
) {
  const queryClient = useQueryClient()

  const sucursalId = options?.sucursalId
  const cajaId = options?.cajaId

  return useMutation<
    VentaDetalle,
    Error,
    CrearVentaPOSPayload,
    CrearVentaContext
  >({
    mutationFn: (payload) =>
      crearVentaPOS(payload),

    /* =====================================================
       OPTIMISTIC STOCK UPDATE
    ===================================================== */

    onMutate: async (payload) => {

      if (!sucursalId) {
        return {}
      }

      const stockKey =
        stockKeys.sucursal(sucursalId)

      await queryClient.cancelQueries({
        queryKey: stockKey,
      })

      const previousStock =
        queryClient.getQueryData<StockItem[]>(
          stockKey
        )

      queryClient.setQueryData<StockItem[]>(
        stockKey,
        (old) => {

          if (!old) return old

          return old.map(item => {

            const sold =
              payload.items.find(
                i => i.productoId === item.productoId
              )

            if (!sold) return item

            const nuevaCantidad =
              item.cantidad - sold.cantidad

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
       ROLLBACK STOCK
    ===================================================== */

    onError: (_error, _payload, ctx) => {

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

    onSuccess: (ventaCreada) => {

      if (cajaId) {

        const ventaApertura =
          mapVentaDetalleToApertura(
            ventaCreada
          )

        queryClient.setQueryData<VentaApertura[]>(
          ventaKeys.apertura(cajaId),
          (old = []) => [
            ventaApertura,
            ...old,
          ]
        )

        queryClient.refetchQueries({
          queryKey: cajaKeys.resumenPrevio(cajaId),
        })
      }

      queryClient.invalidateQueries({
        queryKey: ventaKeys.all,
        exact: false,
      })
    },

    /* =====================================================
       SETTLED
    ===================================================== */

    onSettled: () => {

      if (!sucursalId) return

      // 🔥 Invalida TODO stock
      queryClient.invalidateQueries({
        queryKey: stockKeys.all,
      })
    },
  })
}