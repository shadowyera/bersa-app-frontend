import { useMutation, useQueryClient } from '@tanstack/react-query'
import { anularVentaPOSApi } from '../../api/pos.api'

export function useAnularVentaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ventaId: string) =>
      anularVentaPOSApi(ventaId),

    onSuccess: () => {
      // Lista de ventas
      queryClient.invalidateQueries({
        queryKey: ['ventas-apertura'],
      })

      // Resumen de caja
      queryClient.invalidateQueries({
        queryKey: ['resumen-previo-caja'],
      })
    },
  })
}