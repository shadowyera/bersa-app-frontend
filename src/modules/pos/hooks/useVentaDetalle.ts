import { useQuery } from '@tanstack/react-query'
import { getVentaDetalle } from '../api/pos.api'
import type { VentaDetalle } from '../venta/domain/venta.types'

/**
 * Obtiene el detalle de una venta
 * - Cachea resultado
 * - Solo consulta si existe ventaId
 */
export function useVentaDetalle(
  ventaId?: string
) {
  return useQuery<VentaDetalle>({
    queryKey: ['venta-detalle', ventaId],

    queryFn: () => {
      if (!ventaId) {
        throw new Error('ventaId requerido')
      }
      return getVentaDetalle(ventaId)
    },

    enabled: !!ventaId,

    staleTime: 1000 * 60 * 5, // 5 min

    gcTime: 1000 * 60 * 30, // 30 min (ANTES cacheTime)
  })
}