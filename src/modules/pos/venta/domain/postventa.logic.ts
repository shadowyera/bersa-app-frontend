import type { CartItem } from '../../domain/pos.types'
import type {
  PostVenta,
  PostVentaItem,
} from './postventa.types'

import { buildPosProductName } from '../../utils/productName'

/* =====================================================
   Tipos Backend
===================================================== */

export interface VentaCreadaBackend {
  _id: string

  /** 🔢 Número correlativo por turno */
  numeroVenta?: number

  folio?: string
  createdAt?: string

  /** Total real de productos */
  total: number

  /** Ajuste aplicado solo si hubo efectivo */
  ajusteRedondeo?: number

  /** Total final cobrado (total + ajuste) */
  totalCobrado?: number

  items: {
    productoId: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }[]

  pagos?: {
    tipo: string
    monto: number
  }[]
}

/* =====================================================
   Mapper
===================================================== */

export function mapVentaCreadaToPostVenta(
  venta: VentaCreadaBackend,
  cart: CartItem[]
): PostVenta {

  const items: PostVentaItem[] =
    venta.items.map(i => {
      const fromCart = cart.find(
        c => c.productoId === i.productoId
      )

      return {
        productoId: i.productoId,
        nombre: buildPosProductName(
          fromCart?.nombre ?? 'Producto'
        ),
        cantidad: i.cantidad,
        precioUnitario: i.precioUnitario,
        subtotal: i.subtotal,
      }
    })

  // ✅ confiar solo en backend
  const ajusteRedondeo =
    venta.ajusteRedondeo ?? 0

  const totalCobrado =
    venta.totalCobrado ??
    venta.total + ajusteRedondeo

  return {
    ventaId: venta._id,

    /** 🔢 NUMERO DE VENTA */
    numeroVenta: venta.numeroVenta,

    folio:
      venta.folio ??
      venta._id.slice(-6),

    fecha: new Date(
      venta.createdAt ??
        new Date().toISOString()
    ).toLocaleString('es-CL'),

    total: venta.total,
    ajusteRedondeo,
    totalCobrado,

    items,

    pagos:
      venta.pagos?.map(p => ({
        tipo: p.tipo as any,
        monto: p.monto,
      })) ?? [],
  }
}