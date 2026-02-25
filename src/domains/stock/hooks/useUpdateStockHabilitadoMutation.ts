import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateStockHabilitado } from '../api/stock.api'
import { stockKeys } from '../queries/stock.keys'

interface UpdateStockHabilitadoPayload {
  stockId: string
  habilitado: boolean
}

export function useUpdateStockHabilitadoMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    Error,
    UpdateStockHabilitadoPayload
  >({
    mutationFn: ({ stockId, habilitado }) =>
      updateStockHabilitado(stockId, habilitado),

    onSuccess: () => {
      // 🔥 refresca todo el dominio stock
      queryClient.invalidateQueries({
        queryKey: stockKeys.all,
      })
    },
  })
}