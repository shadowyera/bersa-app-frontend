import { useQuery } from '@tanstack/react-query'
import { getVentasApertura } from '../api/venta.api'
import type { VentaApertura } from '../domain/venta.types'
import { useAnularVentaMutation } from './useAnularVentaMutation'
import { ventaKeys } from '../queries/venta.keys'

export function useVentasApertura(
  cajaId?: string,
  sucursalId?: string
) {

  const ventasQuery = useQuery<VentaApertura[]>({
    queryKey: ventaKeys.apertura(cajaId),

    queryFn: async () => {
      if (!cajaId) return []
      const data = await getVentasApertura(cajaId)
      return data.ventas ?? []
    },

    enabled: !!cajaId,
    placeholderData: previousData => previousData,
    staleTime: 2000,
  })

  const anularMutation =
    useAnularVentaMutation(sucursalId)

  return {
    ventas: ventasQuery.data ?? [],
    loading: ventasQuery.isLoading,
    error: ventasQuery.error,
    refresh: ventasQuery.refetch,

    anularVenta: anularMutation.mutateAsync,
    anulando: anularMutation.isPending,
  }
}