import { useMemo } from 'react'
import type { CartItem } from '@/modules/pos/pos.types'

/**
 * Hook de lectura del carrito.
 *
 * - No muta estado
 * - Solo calcula valores derivados
 * - Pensado para componentes presentacionales
 */
export function useCartSummary(items: CartItem[]) {
  // Total del carrito (suma de subtotales)
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.subtotal,
        0
      ),
    [items]
  )

  // Indica si hay algún item con stock insuficiente
  const hayStockInsuficiente = useMemo(
    () => items.some(i => i.stockInsuficiente),
    [items]
  )

  return {
    total,
    hayStockInsuficiente,
    cantidadItems: items.length,
  }
}