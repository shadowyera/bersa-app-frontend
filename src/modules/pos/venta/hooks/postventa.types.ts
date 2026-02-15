import type { TipoPago } from '../../domain/pos.types'

/* =====================================================
   Item vendido (snapshot)
===================================================== */
export interface PostVentaItem {
  productoId: string
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

/* =====================================================
   Pago aplicado (snapshot)
===================================================== */
export interface PostVentaPago {
  tipo: TipoPago
  monto: number
}

/* =====================================================
   Venta confirmada (proyección UI)
===================================================== */

/**
 * Representación mínima de una venta
 * recién confirmada.
 *
 * Se usa SOLO para UI post-venta
 * (modal, ticket, impresión).
 *
 * ❗ Todos los montos vienen listos desde backend
 */
export interface PostVenta {
  ventaId: string
  folio: string
  fecha: string

  total: number              // productos
  ajusteRedondeo: number     // puede ser 0
  totalCobrado: number       // ✅ NUEVO

  items: PostVentaItem[]
  pagos: PostVentaPago[]
}