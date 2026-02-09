import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { sseClient } from '@/shared/realtime/sse.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'

import type { AperturaCaja } from '../domain/caja.types'

const aperturasActivasKey = (sucursalId: string) => [
  'aperturas-activas',
  sucursalId,
]

function handleCajaAbierta(
  event: RealtimeEvent,
  sucursalId: string,
  queryClient: ReturnType<typeof useQueryClient>
) {
  const aperturaId =
    event.aperturaCajaId ?? event.aperturaId

  const { cajaId, origenUsuarioId, origenUsuarioNombre } =
    event

  if (!aperturaId || !cajaId || !origenUsuarioId) return

  queryClient.setQueryData<AperturaCaja[]>(
    aperturasActivasKey(sucursalId),
    old => {
      const current = old ?? []

      if (current.some(a => a.id === aperturaId)) {
        return current
      }

      return [
        ...current,
        {
          id: aperturaId,
          cajaId,
          sucursalId,
          usuarioAperturaId: origenUsuarioId,
          usuarioAperturaNombre: origenUsuarioNombre,
          fechaApertura: new Date().toISOString(),
          montoInicial: 0,
          estado: 'ABIERTA',
        },
      ]
    }
  )
}

function handleCajaCerrada(
  event: RealtimeEvent,
  sucursalId: string,
  queryClient: ReturnType<typeof useQueryClient>
) {
  const { cajaId } = event
  if (!cajaId) return

  queryClient.setQueryData<AperturaCaja[]>(
    aperturasActivasKey(sucursalId),
    old => (old ?? []).filter(a => a.cajaId !== cajaId)
  )
}

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