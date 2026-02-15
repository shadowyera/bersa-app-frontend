import { useVentasAperturaQuery } from "@/shared/queries/useVentasApertura"
import { useAnularVentaMutation } from './useAnularVentaMutation'

export function useVentasApertura(cajaId?: string) {
  const ventasQuery = useVentasAperturaQuery(cajaId)
  const anularMutation = useAnularVentaMutation()

  return {
    ventas: ventasQuery.data ?? [],
    loading: ventasQuery.isLoading,
    error: ventasQuery.error,
    refresh: ventasQuery.refetch,

    anularVenta: anularMutation.mutateAsync,
    anulando: anularMutation.isPending,
  }
}