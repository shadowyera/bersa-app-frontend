import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/modules/auth/useAuth'

import { getSucursalById } from './sucursal.api'
import type { Sucursal } from './sucursal.types'

export function useSucursalContext() {
  const { user } = useAuth()

  const sucursalId = user?.sucursal.id

  return useQuery<Sucursal>({
    queryKey: ['sucursal', sucursalId],
    queryFn: () => getSucursalById(sucursalId!),
    enabled: Boolean(sucursalId),
    staleTime: Infinity,
  })
}