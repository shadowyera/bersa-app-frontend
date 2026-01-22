import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'

interface Sucursal {
  id: string
  nombre: string
  direccion: string
  esPrincipal: boolean
}

async function getSucursalPrincipal(): Promise<Sucursal> {
  const { data } = await api.get(
    '/sucursales/principal'
  )
  return data
}

export function useSucursalPrincipal() {
  return useQuery({
    queryKey: ['sucursal-principal'],
    queryFn: getSucursalPrincipal,
    staleTime: Infinity,
  })
}