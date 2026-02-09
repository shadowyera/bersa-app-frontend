import { useCallback, useMemo, useState } from 'react'
import type { CartItem } from '../../domain/pos.types'
import type { ProductoVendible } from '../domain/venta.types'

import {
  agregarProducto,
  aumentarCantidad,
  disminuirCantidad,
  calcularTotal,
} from '../domain/venta.logic'

/**
 * Hook de estado de venta
 *
 * - NO contiene reglas de negocio
 * - Solo coordina estado + lógica pura
 * - API estable para evitar renders innecesarios
 */
export const useVenta = () => {
  /* =========================
     STATE
  ========================= */
  const [cart, setCart] = useState<CartItem[]>([])

  /* =========================
     ACTIONS (ESTABLES)
  ========================= */

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

  const clear = useCallback(() => {
    setCart([])
  }, [])

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
    clear,
  }
}