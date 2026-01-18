import { useEffect } from 'react'
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { useAuth } from '@/modules/auth/useAuth'
import {
  registerCajaRealtimeHandler,
} from '../caja.realtime'

/* =====================================================
   Tipo UI
===================================================== */
export interface CajaDisponibleUI {
  id: string
  nombre: string
  abierta: boolean
  usuarioAperturaNombre?: string
  fechaApertura?: string
}

/* =====================================================
   Query key
===================================================== */
export const CAJAS_DISPONIBLES_QUERY_KEY = (
  sucursalId: string
) => ['cajas-disponibles', sucursalId]

/* =====================================================
   Fetcher
===================================================== */
async function fetchCajasDisponibles(
  sucursalId: string
): Promise<CajaDisponibleUI[]> {
  const { data } = await api.get(
    `/cajas?sucursalId=${sucursalId}`
  )

  return data.map((caja: any) => ({
    id: caja.id,
    nombre: caja.nombre,
    abierta: Boolean(caja.abierta),
    usuarioAperturaNombre:
      caja.usuarioAperturaNombre,
    fechaApertura: caja.fechaApertura,
  }))
}

/* =====================================================
   Hook
===================================================== */
export function useCajasDisponibles() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const sucursalId = user?.sucursalId ?? ''

  const query = useQuery<CajaDisponibleUI[]>({
    queryKey:
      CAJAS_DISPONIBLES_QUERY_KEY(sucursalId),
    enabled: Boolean(sucursalId),
    queryFn: () =>
      fetchCajasDisponibles(sucursalId),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  })

  /* -------------------------------
     Realtime
     - SOLO invalida cache
  -------------------------------- */
  useEffect(() => {
    if (!sucursalId) return

    const unregister =
      registerCajaRealtimeHandler(() => {
        queryClient.invalidateQueries({
          queryKey:
            CAJAS_DISPONIBLES_QUERY_KEY(sucursalId),
        })
      })

    return unregister
  }, [sucursalId, queryClient])

  return {
    cajas: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refrescar: query.refetch,
  }
}