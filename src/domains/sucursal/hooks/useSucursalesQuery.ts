import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'

export interface Sucursal {
  id: string
  nombre: string
}

interface UseSucursalesQueryOptions {
  enabled?: boolean
}

export const useSucursalesQuery = (
  options?: UseSucursalesQueryOptions
) => {

  return useQuery<Sucursal[]>({
    queryKey: ['sucursales'],

    queryFn: async () => {
      const { data } = await api.get('/sucursales')

      return data.map((s: any) => ({
        id: s._id,
        nombre: s.nombre,
      }))
    },

    staleTime: 1000 * 60 * 5,

    enabled: options?.enabled ?? true,
  })
}