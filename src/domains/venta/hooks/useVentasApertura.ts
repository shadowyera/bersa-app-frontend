import { useQuery } from '@tanstack/react-query'
import { getVentasApertura } from '../api/venta.api'
import type { VentaApertura } from '../domain/venta.types'

import { useAnularVentaMutation } from './useAnularVentaMutation'
import { ventaKeys } from '../queries/venta.keys'

/* =====================================================
   Hook
===================================================== */

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

  // 🔥 PASAMOS CAJA ID
  const anularMutation =
    useAnularVentaMutation(
      sucursalId,
      cajaId
    )

  /**
   * Adapter semántico:
   * UI llama con venta completa
   */
  const anularVenta = async (
    venta: VentaApertura
  ): Promise<void> => {

    await anularMutation.mutateAsync({
      ventaId: venta.ventaId,
      items: venta.items,
    })
  }

  return {
    ventas: ventasQuery.data ?? [],
    loading: ventasQuery.isLoading,
    error: ventasQuery.error,
    refresh: ventasQuery.refetch,

    anularVenta,
    anulando: anularMutation.isPending,
  }
}