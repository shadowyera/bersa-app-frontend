import { api } from '@/shared/api/api'

import type {
  VentaAdmin,
  VentaAdminDetalle,
} from '../domain/venta-admin.types'

/* ========================================
   PARAMS
======================================== */

export interface ListarVentasAdminParams {
  from?: string
  to?: string
  sucursalId?: string
  cajaId?: string
  usuarioId?: string
  estado?: 'FINALIZADA' | 'ANULADA'
  tipoDocumento?: 'BOLETA' | 'FACTURA'

  // 👇 NUEVO
  page?: number
  limit?: number
}

/* ========================================
   RESPONSE
======================================== */

export interface ListarVentasAdminResponse {
  data: VentaAdmin[]
  page: number
  total: number
  totalPages: number
}

/* ========================================
   LISTAR VENTAS (ADMIN)
======================================== */

export const listarVentasAdmin = async (
  params: ListarVentasAdminParams
): Promise<ListarVentasAdminResponse> => {

  const { data } = await api.get(
    '/admin/ventas',
    { params }
  )

  return {
    data: data.data.map((v: any) => ({
      id: v._id,
      numeroVenta: v.numeroVenta,
      
      aperturaCajaId: v.aperturaCajaId,

      total: v.total,
      totalCobrado: v.totalCobrado,
      estado: v.estado,
      documentoTributario: {
        tipo: v.documentoTributario?.tipo,
      },
      usuarioId: v.usuarioId,
      cajaId: v.cajaId,
      sucursalId: v.sucursalId,
      createdAt: v.createdAt,
    })),

    page: data.page,
    total: data.total,
    totalPages: data.totalPages,
  }
}

/* ========================================
   DETALLE VENTA (ADMIN)
======================================== */

export const obtenerVentaAdminDetalle = async (
  ventaId: string
): Promise<VentaAdminDetalle> => {

  const { data } = await api.get(
    `/admin/ventas/${ventaId}`
  )

  return {
    id: data._id,
    numeroVenta: data.numeroVenta,

    estado: data.estado,

    usuarioId: data.usuarioId,
    cajaId: data.cajaId,
    sucursalId: data.sucursalId,

    documentoTributario: data.documentoTributario,

    total: data.total,
    ajusteRedondeo: data.ajusteRedondeo,
    totalCobrado: data.totalCobrado,
    createdAt: data.createdAt,

    items: data.items.map((i: any) => ({
      productoId: i.productoId,
      nombre: i.nombre,
      cantidad: i.cantidad,
      precioUnitario: i.precioUnitario,
      subtotal: i.subtotal,
    })),

    pagos: data.pagos.map((p: any) => ({
      tipo: p.tipo,
      monto: p.monto,
    })),
  }
}