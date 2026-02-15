import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { sseClient } from '@/shared/realtime/sse.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'

import {
  handleCajaAbierta,
  handleCajaCerrada,
} from '@/domains/caja/realtime/caja.events'

export function useCajaRealtime(sucursalId?: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!sucursalId) return

    const unsubscribe = sseClient.subscribe(
      (event: RealtimeEvent) => {
        if (
          event.sucursalId !== 'GLOBAL' &&
          String(event.sucursalId) !== String(sucursalId)
        ) {
          return
        }

        switch (event.type) {
          case 'CAJA_ABIERTA':
            handleCajaAbierta(
              event,
              sucursalId,
              queryClient
            )
            break

          case 'CAJA_CERRADA':
            handleCajaCerrada(
              event,
              sucursalId,
              queryClient
            )
            break
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [sucursalId, queryClient])
}