import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'

/**
 * Respuesta cruda del backend
 * (tal como viene desde /stock/sucursal/:id)
 */
interface StockItem {
  productoId: {
    _id: string
  }
  cantidad: number
}

/**
 * Hook: useStockSucursal
 *
 * Responsabilidad:
 * - Obtener stock por sucursal
 * - Normalizar la respuesta
 * - Cachear resultados
 *
 * ❗ NO maneja UI
 * ❗ NO conoce el POS
 * ❗ NO muta stock
 */
export function useStockSucursal(sucursalId?: string) {
  /* ===============================
     Query: fetch stock
  =============================== */
  const {
    data = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['stock-sucursal', sucursalId],
    queryFn: async (): Promise<StockItem[]> => {
      if (!sucursalId) return []

      const { data } = await api.get(
        `/stock/sucursal/${sucursalId}`
      )

      return data
    },

    /**
     * Cache optimizado para POS:
     * - no refetch en cada foco
     * - se puede actualizar con polling o ws
     */
    enabled: !!sucursalId,
    staleTime: 1000 * 30, // 30s
    refetchOnWindowFocus: false,
  })

  /* ===============================
     Normalización (clave)
     productoId -> cantidad
  =============================== */
  const stockMap = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {}

    data.forEach(item => {
      map[item.productoId._id] = item.cantidad
    })

    return map
  }, [data])

  return {
    /**
     * Mismo contrato que antes
     * 👉 NO rompe consumidores
     */
    stock: stockMap,

    /**
     * Loading real:
     * - isLoading: primera carga
     * - isFetching: refetch en background
     */
    loading: isLoading || isFetching,

    error,
  }
}