// src/domains/stock/domain/stock.types.ts

export interface StockItem {
  productoId: string
  cantidad: number
}

export interface AdminStockItem extends StockItem {
  stockId: string
  habilitado: boolean
  nombreProducto: string
}