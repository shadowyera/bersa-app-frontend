import { useMutation } from '@tanstack/react-query'
import { api } from '@/shared/api/api'

export function useDespachoMutations() {
  const crearDespachoMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post(
        '/despachos-internos',
        payload
      )
      return data
    },
  })

  return {
    crearDespacho: crearDespachoMutation.mutateAsync,
    isLoading: crearDespachoMutation.isPending,
  }
}