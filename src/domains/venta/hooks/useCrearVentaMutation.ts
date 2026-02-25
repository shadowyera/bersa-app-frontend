import { useMutation, useQueryClient } from '@tanstack/react-query'

import { crearVentaPOS } from '../api/venta.api'
import type {
  CrearVentaPOSPayload,
} from '../api/venta.api'

import { stockKeys } from '@/domains/stock/queries/stock.keys'
import { ventaKeys } from '@/domains/venta/queries/venta.keys'

export function useCrearVentaMutation(
  sucursalId?: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CrearVentaPOSPayload) =>
      crearVentaPOS(payload),

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