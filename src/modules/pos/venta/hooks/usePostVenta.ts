import { useCallback, useState } from 'react'
import type { PostVenta } from '../domain/postventa.types'
import {
  mapVentaCreadaToPostVenta,
  type VentaCreadaBackend,
} from '../domain/postventa.logic'
import type { CartItem } from '../../domain/pos.types'

/**
 * Hook orquestador de PostVenta.
 *
 * - Mantiene última venta confirmada
 * - Abre / cierra modal
 * - Mapea backend → PostVenta
 */
export function usePostVenta() {
  const [venta, setVenta] =
    useState<PostVenta | null>(null)

  const [open, setOpen] =
    useState(false)

  /**
   * Abre flujo post-venta usando:
   * - respuesta backend
   * - snapshot del carrito
   */
  const openPostVenta = useCallback(
    (
      ventaBackend: VentaCreadaBackend,
      cart: CartItem[]
    ) => {
      const postVenta =
        mapVentaCreadaToPostVenta(
          ventaBackend,
          cart
        )

      setVenta(postVenta)
      setOpen(true)
    },
    []
  )

  const closePostVenta = useCallback(() => {
    setVenta(null)
    setOpen(false)
  }, [])

  return {
    open,
    venta,
    openPostVenta,
    closePostVenta,
  }
}

export type PostVentaController =
  ReturnType<typeof usePostVenta>