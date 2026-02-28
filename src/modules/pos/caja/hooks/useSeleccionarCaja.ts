import { useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'

/* =====================================================
   Auth
===================================================== */
import { useAuth } from '@/modules/auth/useAuth'

/* =====================================================
   Context
===================================================== */
import { useCaja } from '../context/CajaProvider'

/* =====================================================
   API
===================================================== */
import {
  getCajasSucursal,
  getAperturasActivasSucursal,
} from '@/domains/caja/api/caja.api'

/* =====================================================
   Domain
===================================================== */
import {
  buildCajasVisuales,
} from '../../../../domains/caja/domain/caja.selectors'

import type { CajaVisual } from '../../../../domains/caja/domain/caja.types'

export function useSeleccionarCaja() {
  const { user } = useAuth()

  const sucursalId = user?.sucursal.id

  const { seleccionarCaja, validandoCaja } = useCaja()

  /* =====================================================
     Snapshot (fuente de verdad)
  ===================================================== */

  const cajasQuery = useQuery({
    queryKey: ['cajas', sucursalId],
    queryFn: () => getCajasSucursal(sucursalId!),
    enabled: !!sucursalId,
    staleTime: 30_000,
  })

  const aperturasQuery = useQuery({
    queryKey: ['aperturas-activas', sucursalId],
    queryFn: () => getAperturasActivasSucursal(sucursalId!),
    enabled: !!sucursalId,
    staleTime: 5_000,
  })

  const cajas: CajaVisual[] = useMemo(() => {
    if (!cajasQuery.data || !aperturasQuery.data) {
      return []
    }

    return buildCajasVisuales(
      cajasQuery.data,
      aperturasQuery.data
    )
  }, [cajasQuery.data, aperturasQuery.data])

  const onSelectCaja = useCallback(
    async (caja: CajaVisual) => {
      if (!sucursalId) return

      await seleccionarCaja({
        id: caja.id,
        nombre: caja.nombre,
        sucursalId,
        activa: true,
      })
    },
    [seleccionarCaja, sucursalId]
  )

  const loading =
    cajasQuery.isLoading || aperturasQuery.isLoading

  const error =
    cajasQuery.error || aperturasQuery.error
      ? 'No se pudieron cargar las cajas'
      : null

  return {
    cajas,
    loading,
    error,
    validandoCaja,
    onSelectCaja,
  }
}