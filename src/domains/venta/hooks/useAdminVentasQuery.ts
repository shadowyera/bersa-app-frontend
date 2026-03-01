import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  listarVentasAdmin,
  obtenerVentaAdminDetalle,
  type ListarVentasAdminParams,
  type ListarVentasAdminResponse,
} from '../api/venta-admin.api'

import type {
  VentaAdminDetalle,
} from '../domain/venta-admin.types'

import { ventaKeys } from '../queries/venta.keys'
import { useDebounce } from '@/shared/hooks/useDebounce'

function cleanParams(
  params?: ListarVentasAdminParams
) {
  if (!params) return {}

  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== ''
    )
  ) as ListarVentasAdminParams
}

export const useAdminVentasQuery = (
  params: ListarVentasAdminParams
) => {

  const debouncedParams = useDebounce(params, 400)

  const stableParams = useMemo(
    () => cleanParams(debouncedParams),
    [debouncedParams]
  )

  const paramsKey = useMemo(
    () => JSON.stringify(stableParams),
    [stableParams]
  )

  return useQuery<ListarVentasAdminResponse>({
    queryKey: ventaKeys.admin.list(paramsKey),

    queryFn: () =>
      listarVentasAdmin(stableParams),

    placeholderData: previous => previous,
    staleTime: 1000 * 30,
  })
}

export const useAdminVentaDetalleQuery = (
  ventaId?: string
) => {
  return useQuery<VentaAdminDetalle>({
    queryKey:
      ventaKeys.admin.detalle(ventaId),

    queryFn: () =>
      obtenerVentaAdminDetalle(ventaId!),

    enabled: Boolean(ventaId),
    staleTime: 1000 * 30,
  })
}