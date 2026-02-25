import { useQuery } from '@tanstack/react-query'

import { getResumenPrevioCaja } from '../api/caja.api'
import { cajaKeys } from '../queries/caja.keys'

export function useResumenPrevioCajaQuery(
  cajaId?: string
) {
  return useQuery({
    queryKey: cajaKeys.resumenPrevio(cajaId),

    queryFn: async () => {
      if (!cajaId) return null
      return getResumenPrevioCaja(cajaId)
    },

    enabled: !!cajaId,

    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}