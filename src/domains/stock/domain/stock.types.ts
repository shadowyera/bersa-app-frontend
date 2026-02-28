/* =====================================================
   STOCK BASE (alineado 1:1 con backend StockSucursal)
===================================================== */

export interface Stock {
  id: string
  productoId: string
  sucursalId: string

  cantidad: number
  habilitado: boolean

  createdAt: string
  updatedAt: string
}

/* =====================================================
   PROYECCIÓN ADMIN (stock + nombre producto)
   Esta estructura asume que el endpoint admin
   ya devuelve nombreProducto (populate o agregación).
===================================================== */

export interface AdminStockItem {
  stockId: string
  productoId: string
  nombreProducto: string

  proveedorId?: string
  proveedorNombre?: string

  cantidad: number
  habilitado: boolean
}

export type EstadoStock =
  | 'NEGATIVO'
  | 'SIN_STOCK'
  | 'BAJO'
  | 'OK'
