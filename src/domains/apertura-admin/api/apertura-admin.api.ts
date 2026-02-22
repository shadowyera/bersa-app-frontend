import { api } from '@/shared/api/api'
import type { VentaAdmin } from '@/domains/venta/domain/venta-admin.types'
import type {
  AperturaAdmin,
  ListarAperturasAdminResponse,
} from '../domain/apertura-admin.types'

/* ========================================
   PARAMS
======================================== */

export interface ListarAperturasAdminParams {
  from?: string
  to?: string
  page?: number
  limit?: number
}

/* ========================================
   LISTAR APERTURAS (ADMIN)
======================================== */

export const listarAperturasAdmin = async (
  params: ListarAperturasAdminParams
): Promise<ListarAperturasAdminResponse> => {

  const { data } = await api.get(
    '/admin/aperturas',
    { params }
  )

  return {
    data: data.data.map((a: any): AperturaAdmin => ({
      id: a.aperturaId,

      cajaId: a.cajaId,
      sucursalId: a.sucursalId,

      usuarioAperturaId: a.usuarioAperturaId,
      usuarioCierreId: a.usuarioCierreId,

      usuarioAperturaNombre: a.usuarioAperturaNombre,
      usuarioCierreNombre: a.usuarioCierreNombre,

      fechaApertura: a.fechaApertura,
      fechaCierre: a.fechaCierre,

      estado: a.estado,

      totalVentas: a.totalVentas,
      totalCobrado: a.totalCobrado,

      diferencia: a.diferencia,
      motivoDiferencia: a.motivoDiferencia,

      ventas: (a.ventas || []).map(
        (v: any): VentaAdmin => ({
          id: v._id,
          folio: v.folio,
          numeroVenta: v.numeroVenta,
          aperturaCajaId: v.aperturaCajaId,
          total: v.total,
          totalCobrado: v.totalCobrado,
          estado: v.estado,
          createdAt: v.createdAt,

          documentoTributario: v.documentoTributario,

          pagos: v.pagos || [],

          usuarioId: v.usuarioId,
          cajaId: v.cajaId,
          sucursalId: v.sucursalId,
        })
      ),
    })),

    page: data.page,
    totalPages: data.totalPages,
  }
}

/* ========================================
   OBTENER DETALLE APERTURA (ADMIN)
======================================== */

export const obtenerAperturaAdminDetalle = async (
  aperturaId: string
): Promise<AperturaAdmin> => {

  const { data } = await api.get(
    `/admin/aperturas/${aperturaId}`
  )

  return {
    id: data.aperturaId,

    cajaId: data.cajaId,
    sucursalId: data.sucursalId,

    usuarioAperturaId: data.usuarioAperturaId,
    usuarioCierreId: data.usuarioCierreId,

    usuarioAperturaNombre: data.usuarioAperturaNombre,
    usuarioCierreNombre: data.usuarioCierreNombre,

    fechaApertura: data.fechaApertura,
    fechaCierre: data.fechaCierre,

    estado: data.estado,

    totalVentas: data.totalVentas,
    totalCobrado: data.totalCobrado,

    diferencia: data.diferencia,
    motivoDiferencia: data.motivoDiferencia,

    ventas: (data.ventas || []).map(
      (v: any): VentaAdmin => ({
        id: v.id ?? v._id,
        folio: v.folio,
        numeroVenta: v.numeroVenta,
        aperturaCajaId: v.aperturaCajaId,
        total: v.total,
        totalCobrado: v.totalCobrado,
        estado: v.estado,
        createdAt: v.createdAt,

        documentoTributario: v.documentoTributario,

        pagos: v.pagos || [],

        usuarioId: v.usuarioId,
        cajaId: v.cajaId,
        sucursalId: v.sucursalId,
      })
    ),
  }
}