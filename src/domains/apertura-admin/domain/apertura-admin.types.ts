import type { VentaAdmin } from "@/domains/venta/domain/venta-admin.types"

export type AperturaEstado =
  | 'ABIERTA'
  | 'CERRADA'

/* =====================================================
   Apertura Admin (para listados y detalle)
===================================================== */

export interface AperturaAdmin {
  id: string

  cajaId: string
  sucursalId: string

  usuarioAperturaId?: string
  usuarioCierreId?: string

  usuarioAperturaNombre?: string
  usuarioCierreNombre?: string

  fechaApertura: string
  fechaCierre?: string

  estado: AperturaEstado

  totalVentas: number
  totalCobrado: number

  diferencia?: number
  motivoDiferencia?: string

  /* 👇 ahora ventas completas */
  ventas: VentaAdmin[]
}

/* =====================================================
   Apertura Admin Detalle (paginado)
===================================================== */

export interface AperturaAdminDetalle
  extends AperturaAdmin {

  page: number
  totalPages: number
}

/* =====================================================
   Listar aperturas response
===================================================== */

export interface ListarAperturasAdminResponse {
  data: AperturaAdmin[]
  page: number
  totalPages: number
}