/* =====================================================
   Productos POS
===================================================== */

/**
 * Producto listo para ser vendido en el POS
 * (contrato de dominio)
 */
export interface ProductoVendible {
  productoId: string
  nombre: string
  precioUnitario: number
  stockDisponible?: number
}

/* =====================================================
   Documento Tributario (Snapshot UI)
===================================================== */

/**
 * Datos del receptor cuando el documento es FACTURA
 */
export interface DocumentoReceptor {
  rut: string
  razonSocial: string
  giro: string
  direccion: string
  comuna: string
  ciudad: string
}

/**
 * Información tributaria básica del documento
 * (NO representa emisión electrónica)
 */
export interface DocumentoTributario {
  tipo: 'BOLETA' | 'FACTURA'
  receptor?: DocumentoReceptor
  requiereEmisionSii: boolean
}

/* =====================================================
   Ventas POS (Dominio UI)
===================================================== */

/**
 * Item dentro del detalle de una venta
 */
export interface VentaDetalleItem {
  productoId: string
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

/**
 * Pago aplicado a una venta
 */
export interface VentaDetallePago {
  tipo: string
  monto: number
}

/**
 * Venta con detalle completo
 * (panel derecho + ticket)
 */
export interface VentaDetalle {
  _id: string
  numeroVenta: number

  documentoTributario: DocumentoTributario

  total: number
  ajusteRedondeo: number
  totalCobrado: number

  createdAt: string

  items: VentaDetalleItem[]
  pagos: VentaDetallePago[]
}

/* =====================================================
   Venta listada en resumen de caja
===================================================== */

export interface VentaApertura {
  ventaId: string
  numeroVenta: number
  fecha: string
  total: number
  estado: 'FINALIZADA' | 'ANULADA'
  documentoTributario: {
    tipo: 'BOLETA' | 'FACTURA'
  }
}