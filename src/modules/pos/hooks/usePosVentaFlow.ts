import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { crearVentaPOS } from '../api/pos.api'
import { useVenta } from '../venta/hooks/useVenta'
import { usePostVenta } from '../venta/hooks/usePostVenta'
import { useCaja } from '../Caja/context/CajaProvider'

import type { ConfirmVentaPayload } from '../domain/pos.contracts'

export function usePosVentaFlow() {
  const venta = useVenta()
  const postVenta = usePostVenta()
  const queryClient = useQueryClient()

  const { cajaSeleccionada, aperturaActiva } =
    useCaja()

  const onConfirmVenta = useCallback(
    async ({ pagos }: ConfirmVentaPayload) => {
      if (!cajaSeleccionada || !aperturaActiva) {
        return
      }

      const ventaCreada = await crearVentaPOS({
        cajaId: cajaSeleccionada.id,
        aperturaCajaId: aperturaActiva.id,
        pagos,
        items: venta.cart.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
      })

      postVenta.openPostVenta(
        ventaCreada,
        venta.cart
      )

      queryClient.invalidateQueries({
        queryKey: ['stock-sucursal'],
      })

      venta.clear()
    },
    [
      cajaSeleccionada,
      aperturaActiva,
      venta,
      postVenta,
      queryClient,
    ]
  )

  return {
    venta,
    postVenta,
    onConfirmVenta,
  }
}