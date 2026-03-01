import type {
  Producto,
  PresentacionProducto,
  ReglaPrecio,
} from '../domain/producto.types'

import type { ProductoDTO } from '../api/producto.api'

/**
 * =====================================================
 * API → DOMINIO
 * =====================================================
 * - Convierte _id → id
 * - Normaliza proveedorId y categoriaId a string
 * - Nunca expone objetos populate
 * - Garantiza arrays siempre definidos
 * =====================================================
 */
export function mapProductoFromApi(
  raw: ProductoDTO
): Producto {
  return {
    id: raw._id,

    nombre: raw.nombre,
    descripcion: raw.descripcion,

    precio: raw.precio,
    codigo: raw.codigo,

    categoriaId:
      raw.categoriaId ?? undefined,

    proveedorId: raw.proveedorId
      ? typeof raw.proveedorId === 'object'
        ? raw.proveedorId._id
        : raw.proveedorId
      : undefined,

    activo: raw.activo,

    unidadBase: raw.unidadBase,

    presentaciones:
      raw.presentaciones?.map(
        (p): PresentacionProducto => ({
          id: p._id,
          nombre: p.nombre,
          unidades: p.unidades,
          precioUnitario: p.precioUnitario,
          precioTotal: p.precioTotal,
        })
      ) ?? [],

    reglasPrecio:
      raw.reglasPrecio?.map(
        (r: any): ReglaPrecio => ({
          id: r._id,
          cantidadMinima: r.cantidadMinima,
          precioUnitario: r.precioUnitario,
        })
      ) ?? [],

    fechaVencimiento:
      raw.fechaVencimiento ?? undefined,

    imagenUrl:
      raw.imagenUrl ?? undefined,
  }
}