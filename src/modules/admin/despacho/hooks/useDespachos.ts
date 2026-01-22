import { useQuery } from '@tanstack/react-query'
import { getDespachosDestino } from '../domain/despacho.api'
import type { DespachoInterno } from '../domain/despacho.types'

export function useDespachos() {
  return useQuery<DespachoInterno[]>({
    queryKey: ['despachos'],
    queryFn: getDespachosDestino,
    select: data =>
      (data ?? []).map(despacho => ({
        ...despacho,
        id: (despacho as any)._id, // 🔥 NORMALIZACIÓN
      })),
  })
}