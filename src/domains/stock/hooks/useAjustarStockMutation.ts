import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ajustarStockAdmin } from '../api/stock.api'
import { stockKeys } from '../queries/stock.keys'

export function useAjustarStockMutation(
  sucursalId: string
) {

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      stockId,
      cantidad,
      motivo,
    }: {
      stockId: string
      cantidad: number
      motivo: string
    }) =>
      ajustarStockAdmin(stockId, cantidad, motivo),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stockKeys.admin(sucursalId),
      })
    },
  })
}