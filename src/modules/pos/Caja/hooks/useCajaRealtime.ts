import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { sseClient } from '@/shared/realtime/sse.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'

import type { AperturaCaja } from '../domain/caja.types'

/* =====================================================
   Helpers – React Query updates
===================================================== */

function handleCajaAbierta(
  event: RealtimeEvent,
  sucursalId: string,
  queryClient: ReturnType<typeof useQueryClient>
) {
  const {
    aperturaCajaId,
    cajaId,
    origenUsuarioId,
    origenUsuarioNombre,
  } = event

  if (!aperturaCajaId || !cajaId || !origenUsuarioId) {
    return
  }

  queryClient.setQueryData<AperturaCaja[]>(
    ['aperturas-activas', sucursalId],
    old => {
      const current = old ?? []

      // Evitar duplicados
      if (current.some(a => a.id === aperturaCajaId)) {
        return current
      }

      const nuevaApertura: AperturaCaja = {
        id: aperturaCajaId,
        cajaId,
        sucursalId,
        usuarioAperturaId: origenUsuarioId,
        usuarioAperturaNombre: origenUsuarioNombre,
        fechaApertura: new Date().toISOString(),
        montoInicial: 0,
        estado: 'ABIERTA',
      }

      return [...current, nuevaApertura]
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
    ['aperturas-activas', sucursalId],
    old => (old ?? []).filter(a => a.cajaId !== cajaId)
  )
}

/* =====================================================
   Hook
===================================================== */

export function useCajaRealtime(sucursalId?: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!sucursalId) return

    const unsubscribe = sseClient.subscribe(
      (event: RealtimeEvent) => {
        // =============================
        // Filtro por sucursal
        // =============================
        if (event.sucursalId !== sucursalId) return

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

          default:
            break
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [sucursalId, queryClient])
}