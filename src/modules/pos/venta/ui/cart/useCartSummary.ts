import { useMemo } from 'react'
import type { CartItem } from '@/modules/pos/pos.types'

/**
 * Hook de lectura para el carrito
 *
 * - NO muta estado
 * - SOLO calcula derivados
 */
export function useCartSummary(items: CartItem[]) {
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.subtotal,
        0
      ),
    [items]
  )

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