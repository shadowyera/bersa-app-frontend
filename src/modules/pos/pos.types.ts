// src/pos/types/pos.types.ts

export const TIPOS_PAGO = [
  'EFECTIVO',
  'DEBITO',
  'CREDITO',
  'MIXTO',
  'TRANSFERENCIA',
] as const

export type TipoPago = typeof TIPOS_PAGO[number]

export interface PagoPOS {
  tipo: TipoPago
  monto: number
}

export interface CartItem {
  productoId: string
  nombre: string
  precioUnitario: number
  cantidad: number
  subtotal: number

  // estado UI del POS
  stockDisponible?: number
  stockInsuficiente?: boolean
}

export interface ProductoPOS {
  _id: string
  nombre: string
  precio: number
  activo: boolean
  codigo?: string
}