import { useMemo } from 'react'
import type { CartItem } from '@/modules/pos/domain/pos.types'

/**
 * =====================================================
 * useCartSummary
 *
 * Hook de lectura del carrito.
 *
 * - No muta estado
 * - Calcula valores derivados
 * - Pensado para UI presentacional
 * =====================================================
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