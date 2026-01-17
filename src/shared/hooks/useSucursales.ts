import { useEffect, useState } from 'react'
import { getSucursales, type Sucursal } from '@/shared/api/sucursal.api'

export function useSucursales() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSucursales()
      .then(setSucursales)
      .finally(() => setLoading(false))
  }, [])

  return { sucursales, loading }
}