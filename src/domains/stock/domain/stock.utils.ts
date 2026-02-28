import type { AdminStockItem, EstadoStock } from './stock.types'

export function getEstadoStock(
  item: AdminStockItem,
  limiteBajo: number
): EstadoStock {

  if (item.cantidad < 0) return 'NEGATIVO'
  if (item.cantidad === 0) return 'SIN_STOCK'
  if (item.cantidad <= limiteBajo) return 'BAJO'
  return 'OK'
}

export function getEstadoColor(estado: EstadoStock) {
  switch (estado) {
    case 'NEGATIVO':
      return 'text-red-400'
    case 'SIN_STOCK':
      return 'text-orange-400'
    case 'BAJO':
      return 'text-yellow-400'
    case 'OK':
    default:
      return 'text-emerald-400'
  }
}