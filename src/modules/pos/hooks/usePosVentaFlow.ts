import { useCallback, useState } from 'react'

import { useVenta } from '@/domains/venta/hooks/useVenta'
import { usePostVenta } from '@/domains/venta/hooks/usePostVenta'
import { useCrearVentaMutation } from '@/domains/venta/hooks/useCrearVentaMutation'

import { useCaja } from '@/modules/pos/caja/context/CajaProvider'

import type {
  ConfirmVentaPayload,
} from '@/domains/venta/domain/venta.contracts'

export function usePosVentaFlow() {

  const venta = useVenta()
  const postVenta = usePostVenta()

  const { cajaSeleccionada, aperturaActiva } =
    useCaja()

  const crearVenta =
    useCrearVentaMutation({
      sucursalId: cajaSeleccionada?.sucursalId,
      cajaId: cajaSeleccionada?.id,
    })

  /* ===============================
     UI STATE
  =============================== */

  const [showReceptor, setShowReceptor] =
    useState(false)

  const openReceptor = useCallback(() => {
    setShowReceptor(true)
  }, [])

  const closeReceptor = useCallback(() => {
    setShowReceptor(false)
  }, [])

  /* ===============================
     CONFIRM VENTA
  =============================== */

  const onConfirmVenta = useCallback(
    async ({ pagos }: ConfirmVentaPayload) => {

      if (!cajaSeleccionada || !aperturaActiva) {
        return
      }

      const ventaCreada =
        await crearVenta.mutateAsync({
          cajaId: cajaSeleccionada.id,
          aperturaCajaId: aperturaActiva.id,

          pagos,

          items: venta.cart.map(item => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          })),

          documentoTributario:
            venta.documentoTributario,
        })

      postVenta.openPostVenta(
        ventaCreada,
        venta.cart
      )

      venta.clear()
      closeReceptor()

    },
    [
      cajaSeleccionada,
      aperturaActiva,
      venta,
      postVenta,
      crearVenta,
      closeReceptor,
    ]
  )

  return {
    venta,
    postVenta,

    showReceptor,
    openReceptor,
    closeReceptor,

    onConfirmVenta,
  }
}