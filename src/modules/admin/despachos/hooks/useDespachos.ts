import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import type { DespachoInterno } from '../domain/despacho.types'

/* =====================================================
   Response crudo del backend
===================================================== */

interface DespachosResponseRaw {
  data: any[]
  total: number
  page: number
  limit: number
}

/* =====================================================
   Hook: useDespachos
===================================================== */

export function useDespachos() {
  /* =========================
     Paginación
  ========================= */

  const [page, setPage] = useState(1)
  const limit = 10

  /* =========================
     Query
  ========================= */

  const query = useQuery<DespachosResponseRaw>({
    queryKey: ['despachos-internos', page],
    queryFn: async () => {
      const { data } = await api.get<DespachosResponseRaw>(
        '/despachos-internos',
        {
          params: { page, limit },
        }
      )

      return data
    },

    // equivalente a keepPreviousData
    placeholderData: previous => previous,
  })

  /* =========================
     Normalización (CLAVE)
  ========================= */

  const despachos: DespachoInterno[] = (
    query.data?.data ?? []
  ).map(raw => ({
    id: raw._id,
    origen: raw.origen,
    sucursalOrigenId: raw.sucursalOrigenId,
    estado: raw.estado,
    items: raw.items ?? [],
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }))

  const total = query.data?.total ?? 0

  /* =========================
     API expuesta
  ========================= */

  return {
    despachos,
    total,

    page,
    setPage,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  }
}