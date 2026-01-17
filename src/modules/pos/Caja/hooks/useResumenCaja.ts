import { useCallback, useEffect, useState } from 'react'
import { api } from '@/shared/api/api'

/**
 * Resumen informativo de la caja
 * NO cierra la caja
 * Puede usarse para:
 * - ver estado actual
 * - cuadrar momentáneamente
 * - previo al cierre
 */
export interface ResumenCajaResponse {
  cajaId: string
  aperturaId: string

  montoInicial: number
  totalVentas: number
  efectivoVentas: number
  efectivoEsperado: number
}

export function useResumenCaja(cajaId: string) {
  const [data, setData] =
    useState<ResumenCajaResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchResumen = useCallback(async () => {
    if (!cajaId) return

    setLoading(true)
    try {
      const { data } = await api.get<ResumenCajaResponse>(
        `/cajas/${cajaId}/resumen-previo`
      )
      setData(data)
    } finally {
      setLoading(false)
    }
  }, [cajaId])

  useEffect(() => {
    fetchResumen()
  }, [fetchResumen])

  return {
    data,
    loading,
    refresh: fetchResumen,
  }
}