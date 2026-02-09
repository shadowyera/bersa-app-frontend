import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'

/**
 * Resumen informativo de una caja.
 *
 * - NO cierra la caja
 * - NO modifica estado
 * - Se usa para visualización y cuadratura
 */
export interface ResumenCajaResponse {
  cajaId: string
  aperturaId: string

  montoInicial: number
  totalVentas: number
  efectivoVentas: number
  efectivoEsperado: number
}

/**
 * Hook de lectura del resumen de caja.
 *
 * Mantiene la MISMA interfaz pública que antes.
 */
export function useResumenCaja(cajaId?: string) {
  const query = useQuery({
    queryKey: ['resumen-caja', cajaId],
    queryFn: async () => {
      const { data } =
        await api.get<ResumenCajaResponse>(
          `/cajas/${cajaId}/resumen-previo`
        )
      return data
    },
    enabled: Boolean(cajaId),
    staleTime: 30_000,
  })

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    refresh: query.refetch,
  }
}