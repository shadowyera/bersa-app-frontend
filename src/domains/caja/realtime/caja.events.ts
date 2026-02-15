import type { QueryClient } from '@tanstack/react-query'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'
import type { AperturaCaja } from '../domain/caja.types'

export const aperturasActivasKey = (sucursalId: string) => [
  'aperturas-activas',
  sucursalId,
]

export function handleCajaAbierta(
  event: RealtimeEvent,
  sucursalId: string,
  queryClient: QueryClient
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

export function handleCajaCerrada(
  event: RealtimeEvent,
  sucursalId: string,
  queryClient: QueryClient
) {
  const { cajaId } = event
  if (!cajaId) return

  queryClient.setQueryData<AperturaCaja[]>(
    aperturasActivasKey(sucursalId),
    old => (old ?? []).filter(a => a.cajaId !== cajaId)
  )
}