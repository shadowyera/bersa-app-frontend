import { useQuery } from '@tanstack/react-query'

import { obtenerStockAdmin } from '../api/stock.api'
import { stockKeys } from '../queries/stock.keys'
import type { AdminStockItem } from '../domain/stock.types'

export function useAdminStockQuery(
  sucursalId?: string
) {
  return useQuery<AdminStockItem[]>({
    queryKey: stockKeys.admin(sucursalId as string),

    queryFn: () => {
      if (!sucursalId) return Promise.resolve([])
      return obtenerStockAdmin(sucursalId)
    },

    enabled: !!sucursalId,

    staleTime: 0,
    refetchOnMount: 'always',
  })
}