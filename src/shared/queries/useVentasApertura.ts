import { useQuery } from '@tanstack/react-query'
import { getVentasApertura } from '@/modules/pos/api/pos.api'
import type { VentaApertura } from '@/modules/pos/venta/domain/venta.types'

export function useVentasAperturaQuery(cajaId?: string) {
  return useQuery<VentaApertura[]>({
    queryKey: ['ventas-apertura', cajaId],

    queryFn: async () => {
      if (!cajaId) return []

      const data = await getVentasApertura(cajaId)
      return data.ventas ?? []
    },

    enabled: !!cajaId,
  })
}