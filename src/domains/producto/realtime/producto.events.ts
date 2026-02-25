import type { QueryClient } from '@tanstack/react-query'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'

import { productoKeys } from '@/domains/producto/queries/producto.keys'
import { stockKeys } from '@/domains/stock/queries/stock.keys'

/**
 * =====================================================
 * Producto Realtime Events (DOMINIO)
 * =====================================================
 * Reglas puras:
 * - Decide qué eventos afectan al catálogo
 * - Invalida queries correspondientes
 *
 * NO usa React
 * NO usa SSE
 * NO conoce UI
 * =====================================================
 */

export function handleProductoRealtimeEvent(
  event: RealtimeEvent,
  queryClient: QueryClient
) {
  if (
    event.type !== 'PRODUCTO_CREATED' &&
    event.type !== 'PRODUCTO_UPDATED' &&
    event.type !== 'PRODUCTO_DELETED'
  ) {
    return
  }

  // 🔄 Refrescar todo el dominio producto
  queryClient.invalidateQueries({
    queryKey: productoKeys.all,
    exact: false,
  })

  // 📦 Refrescar todo el dominio stock
  queryClient.invalidateQueries({
    queryKey: stockKeys.all,
    exact: false,
  })
}