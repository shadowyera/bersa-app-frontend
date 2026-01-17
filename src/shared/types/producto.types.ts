// shared/types/producto.types.ts

import type { Proveedor } from './proveedor.types'

export interface Producto {
  _id: string
  nombre: string
  descripcion?: string
  precio: number
  codigo?: string

  categoriaId?: string
  proveedorId?: string | Pick<Proveedor, '_id' | 'nombre'>

  activo: boolean
  unidadBase: 'KG' | 'UN' | 'LT' | string

  presentaciones: PresentacionProducto[]
  reglasPrecio: ReglaPrecio[]

  fechaVencimiento?: string
  imagenUrl?: string
}

export interface PresentacionProducto {
  _id: string
  nombre: string
  unidades: number
  precioUnitario: number
  precioTotal: number
}

export interface ReglaPrecio {
  _id: string
  cantidadMinima: number
  precioUnitario: number
}

/* DTOs */

export interface CreateProductoDTO {
  nombre: string
  descripcion?: string
  precio: number
  codigo?: string
  categoriaId?: string
  proveedorId?: string
  unidadBase: string
  fechaVencimiento?: string
  imagenUrl?: string
}

export interface UpdateProductoDTO
  extends Partial<CreateProductoDTO> {
  activo?: boolean
}