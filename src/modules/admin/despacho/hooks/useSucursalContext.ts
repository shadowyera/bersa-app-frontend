import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { useAuth } from '@/modules/auth/useAuth'

interface Sucursal {
  id: string
  nombre: string
  direccion: string
  esPrincipal: boolean
}

async function getSucursalById(id: string): Promise<Sucursal> {
  const { data } = await api.get(`/sucursales/${id}`)
  return data
}

/**
 * =====================================================
 * Hook de contexto de sucursal
 *
 * Fuente ÚNICA de verdad para:
 * - esPrincipal
 * - datos básicos de la sucursal
 * =====================================================
 */
export function useSucursalContext() {
  const { user } = useAuth()
  const sucursalId = user?.sucursalId

  return useQuery({
    queryKey: ['sucursal', sucursalId],
    queryFn: () => getSucursalById(sucursalId!),
    enabled: Boolean(sucursalId),
    staleTime: Infinity, // casi nunca cambia
  })
}