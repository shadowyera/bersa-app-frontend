import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { sseClient } from '@/shared/realtime/sse.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'

export function usePedidosRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const PEDIDO_EVENTS: RealtimeEvent['type'][] = [
      'PEDIDO_CREATED',
      'PEDIDO_PREPARADO',
      'PEDIDO_DESPACHADO',
    ]

    const unsubscribe = sseClient.subscribe(event => {
      if (PEDIDO_EVENTS.includes(event.type)) {
        queryClient.refetchQueries({
          queryKey: ['pedidos'],
          type: 'active',
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [queryClient])
}