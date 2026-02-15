import type { TipoPago } from "@/modules/pos/domain/pos.types"

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

export interface PostVenta {
  ventaId: string

  /** 🔢 Número correlativo por turno */
  numeroVenta?: number

  folio: string
  fecha: string

  total: number
  ajusteRedondeo: number
  totalCobrado: number

  items: PostVentaItem[]
  pagos: PostVentaPago[]

  documentoTributario?: {
    tipo: 'BOLETA' | 'FACTURA'
    rut?: string
  }
}