import { useMutation, useQueryClient } from '@tanstack/react-query'

import { anularVentaPOSApi } from '../api/venta.api'

import { stockKeys } from '@/domains/stock/queries/stock.keys'
import { ventaKeys } from '@/domains/venta/queries/venta.keys'

export function useAnularVentaMutation(
  sucursalId?: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ventaId: string) =>
      anularVentaPOSApi(ventaId),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ventaKeys.all,
        exact: false,
      })

      if (sucursalId) {
        queryClient.invalidateQueries({
          queryKey: stockKeys.sucursal(sucursalId),
          exact: false,
        })
      }
    },
  })
}