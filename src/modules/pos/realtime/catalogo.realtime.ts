import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { realtimeClient } from '@/shared/realtime/realtime.client'
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
 * ✔ No crea conexión SSE
 * ✔ No maneja estado local
 * ✔ No decide UI
 * =====================================================
 */
export function useCatalogoRealtime() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  useEffect(() => {
    /**
     * Invalida todas las queries relacionadas a productos
     * Mantiene la lógica centralizada y reutilizable
     */
    const invalidateProductos = (productoId?: string) => {
      // Listado general de productos (POS, Admin, selectores)
      queryClient.invalidateQueries({
        predicate: query =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'productos',
      })

      // Producto individual (detalle / edición)
      if (productoId) {
        queryClient.invalidateQueries({
          queryKey: ['producto', productoId],
        })
      }
    }

    /**
     * Handler genérico para eventos de producto / stock
     * Incluye protección contra self-events
     */
    const handleProductoEvent = (event: RealtimeEvent) => {
      const origenUsuarioId = event.origenUsuarioId

      // Ignorar eventos originados por el mismo usuario
      if (origenUsuarioId && origenUsuarioId === user?._id) {
        return
      }

      invalidateProductos(event.productoId)
    }

    /**
     * Tipos de eventos que afectan el catálogo
     * Declarativo y fácil de extender
     */
    const PRODUCTO_EVENTS: RealtimeEvent['type'][] = [
      'PRODUCTO_CREATED',
      'PRODUCTO_UPDATED',
      'PRODUCTO_DELETED',
      'STOCK_ACTUALIZADO',
    ]

    /**
     * Registro de listeners SSE
     * Cada dominio escucha SOLO lo que le compete
     */
    const unsubscribers = PRODUCTO_EVENTS.map(type =>
      realtimeClient.on(type, handleProductoEvent)
    )

    /**
     * Cleanup automático
     */
    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [queryClient, user?._id])
}