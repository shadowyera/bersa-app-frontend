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

export const ADMIN_VENTAS_QUERY_KEY = ['admin-ventas']
export const ADMIN_VENTA_DETALLE_QUERY_KEY = [
  'admin-venta-detalle',
]

/* ============================================
   Utils
============================================ */

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

/* ============================================
   LISTAR VENTAS (PAGINADO)
============================================ */

export const useAdminVentasQuery = (
  params: ListarVentasAdminParams
) => {
  const stableParams = useMemo(
    () => cleanParams(params),
    [params]
  )

  const paramsKey = useMemo(
    () => JSON.stringify(stableParams),
    [stableParams]
  )

  return useQuery<ListarVentasAdminResponse>({
    queryKey: [
      ...ADMIN_VENTAS_QUERY_KEY,
      paramsKey,
    ],
    queryFn: () => {
      console.log(
        'ADMIN VENTAS PARAMS =>',
        stableParams
      )
      return listarVentasAdmin(stableParams)
    },
    placeholderData: previous => previous,
    staleTime: 1000 * 30,
  })
}

/* ============================================
   DETALLE VENTA
============================================ */

export const useAdminVentaDetalleQuery = (
  ventaId?: string
) => {
  return useQuery<VentaAdminDetalle>({
    queryKey: [
      ...ADMIN_VENTA_DETALLE_QUERY_KEY,
      ventaId,
    ],
    queryFn: () =>
      obtenerVentaAdminDetalle(ventaId!),
    enabled: Boolean(ventaId),
    staleTime: 1000 * 30,
  })
}