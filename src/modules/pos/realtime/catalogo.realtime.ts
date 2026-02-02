import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { sseClient } from '@/shared/realtime/sse.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'
import { useAuth } from '@/modules/auth/useAuth'

/**
 * =====================================================
 * Realtime – Catálogo de productos (POS + Admin)
 *
 * Responsabilidad ÚNICA:
 * - Escuchar eventos SSE del dominio Productos / Stock
 * - Invalidar cache de React Query de forma precisa
 *
 * ✔ NO crea conexión SSE
 * ✔ NO maneja estado local
 * ✔ Infraestructura ya conectada por RealtimeProvider
 * =====================================================
 */
export function useCatalogoRealtime() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  useEffect(() => {
    /**
     * Invalida queries relacionadas a productos
     */
    const invalidateProductos = (productoId?: string) => {
      // Listados de productos (POS / Admin)
      queryClient.invalidateQueries({
        predicate: query =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'productos',
      })

      // Producto individual
      if (productoId) {
        queryClient.invalidateQueries({
          queryKey: ['producto', productoId],
        })
      }
    }

    /**
     * Eventos que afectan el catálogo
     */
    const PRODUCTO_EVENTS: RealtimeEvent['type'][] = [
      'PRODUCTO_CREATED',
      'PRODUCTO_UPDATED',
      'PRODUCTO_DELETED',
      'STOCK_ACTUALIZADO',
    ]

    /**
     * Handler global SSE
     * - Filtra por tipo
     * - Ignora self-events
     */
    const handler = (event: RealtimeEvent) => {
      // Solo eventos de catálogo
      if (!PRODUCTO_EVENTS.includes(event.type)) {
        return
      }

      // Ignorar eventos propios
      if (
        event.origenUsuarioId &&
        event.origenUsuarioId === user?._id
      ) {
        return
      }

      invalidateProductos(event.productoId)
    }

    /**
     * Suscripción SSE
     */
    const unsubscribe = sseClient.subscribe(handler)

    return () => {
      unsubscribe()
    }
  }, [queryClient, user?._id])
}