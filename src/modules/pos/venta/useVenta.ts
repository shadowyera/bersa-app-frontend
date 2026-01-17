import { useCallback, useMemo, useState } from 'react'
import type { CartItem } from '../pos.types'
import type { ProductoVendible } from './venta.types'

import {
  agregarProducto,
  aumentarCantidad,
  disminuirCantidad,
  calcularTotal,
} from './venta.logic'

/**
 * Hook de estado de venta
 *
 * - NO contiene reglas de negocio
 * - Solo coordina estado + lógica pura
 */
export const useVenta = () => {
  /* =========================
     STATE
  ========================= */
  const [cart, setCart] = useState<CartItem[]>([])

  /* =========================
     ACTIONS
  ========================= */

  /**
   * Agregar producto
   * - delega 100% a venta.logic
   */
  const addProduct = useCallback(
    (producto: ProductoVendible) => {
      setCart(prev =>
        agregarProducto(prev, producto)
      )
    },
    []
  )

  const increase = useCallback(
    (productoId: string) => {
      setCart(prev =>
        aumentarCantidad(prev, productoId)
      )
    },
    []
  )

  const decrease = useCallback(
    (productoId: string) => {
      setCart(prev =>
        disminuirCantidad(prev, productoId)
      )
    },
    []
  )

  /* =========================
     DERIVED STATE
  ========================= */
  const hayStockInsuficiente = useMemo(
    () => cart.some(i => i.stockInsuficiente),
    [cart]
  )

  const total = useMemo(
    () => calcularTotal(cart),
    [cart]
  )

  /* =========================
     PUBLIC API
  ========================= */
  return {
    cart,
    total,
    addProduct,
    increase,
    decrease,
    hayStockInsuficiente,
    clear: () => setCart([]),
  }
}