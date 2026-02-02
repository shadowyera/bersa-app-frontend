import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { realtimeClient } from '@/shared/realtime/realtime.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'

export function usePedidosRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const refetchPedidos = () => {
      queryClient.refetchQueries({
        queryKey: ['pedidos'],
        type: 'active',
      })
    }

    const handlePedidoEvent = (_event: RealtimeEvent) => {
      refetchPedidos()
    }

    const PEDIDO_EVENTS: RealtimeEvent['type'][] = [
      'PEDIDO_CREATED',
      'PEDIDO_PREPARADO',
      'PEDIDO_DESPACHADO',
    ]

    const unsubscribers = PEDIDO_EVENTS.map(type =>
      realtimeClient.on(type, handlePedidoEvent)
    )

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [queryClient])
}