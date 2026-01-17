import { useEffect } from 'react'
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { useAuth } from '@/modules/auth/useAuth'

/* =====================================================
   Tipo UI para el selector
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
    fechaApertura:
      caja.fechaApertura,
  }))
}

/* =====================================================
   Hook
===================================================== */
export function useCajasDisponibles() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const sucursalId = user?.sucursalId ?? ''

  /* -------------------------------
     React Query
  -------------------------------- */
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
     SSE
     👉 SOLO refresca la lista
  -------------------------------- */
  useEffect(() => {
    if (!sucursalId) return

    const es = new EventSource('/api/realtime/cajas')


    es.onmessage = () => {
      queryClient.invalidateQueries({
        queryKey:
          CAJAS_DISPONIBLES_QUERY_KEY(sucursalId),
      })
    }

    es.onerror = () => {
      es.close()
    }

    return () => {
      es.close()
    }
  }, [sucursalId, queryClient])

  /* -------------------------------
     API del hook
  -------------------------------- */
  return {
    cajas: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refrescar: query.refetch,
  }
}