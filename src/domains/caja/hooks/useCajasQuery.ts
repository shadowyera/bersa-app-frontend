import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'

import { cajaKeys } from '../queries/caja.keys'

export interface Caja {
  id: string
  nombre: string
}

export const useCajasQuery = () => {
  return useQuery<Caja[]>({
    queryKey: cajaKeys.lists(),

    queryFn: async () => {
      const { data } = await api.get('/cajas')

      return data.map((c: any) => ({
        id: c.id,
        nombre: c.nombre,
      }))
    },

    staleTime: 1000 * 60 * 5,
  })
}