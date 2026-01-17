import type { CartItem } from '../pos.types'
import type { ProductoVendible } from './venta.types'

/**
 * Agregar producto al carrito
 *
 * Reglas:
 * - Si existe, aumenta cantidad
 * - Si no existe, lo agrega
 * - Siempre recalcula subtotal
 * - Marca stock insuficiente si aplica
 */
export function agregarProducto(
  cart: CartItem[],
  producto: ProductoVendible
): CartItem[] {
  const stock = producto.stockDisponible

  const existing = cart.find(
    i => i.productoId === producto.productoId
  )

  if (existing) {
    const nuevaCantidad = existing.cantidad + 1

    const stockInsuficiente =
      stock !== undefined &&
      nuevaCantidad > stock

    return cart.map(item =>
      item.productoId === producto.productoId
        ? {
            ...item,
            cantidad: nuevaCantidad,
            subtotal:
              nuevaCantidad * item.precioUnitario,
            stockInsuficiente,
          }
        : item
    )
  }

  return [
    ...cart,
    {
      productoId: producto.productoId,
      nombre: producto.nombre,
      precioUnitario: producto.precioUnitario,
      cantidad: 1,
      subtotal: producto.precioUnitario,
      stockInsuficiente:
        stock !== undefined && stock < 1,
    },
  ]
}

/**
 * Aumentar cantidad de un producto existente
 */
export function aumentarCantidad(
  cart: CartItem[],
  productoId: string
): CartItem[] {
  return cart.map(item => {
    if (item.productoId !== productoId)
      return item

    const nuevaCantidad = item.cantidad + 1
    const stock = item.stockDisponible

    return {
      ...item,
      cantidad: nuevaCantidad,
      subtotal:
        nuevaCantidad * item.precioUnitario,
      stockInsuficiente:
        stock !== undefined &&
        nuevaCantidad > stock,
    }
  })
}

/**
 * Disminuir cantidad
 */
export function disminuirCantidad(
  cart: CartItem[],
  productoId: string
): CartItem[] {
  return cart
    .map(item =>
      item.productoId === productoId
        ? {
            ...item,
            cantidad: item.cantidad - 1,
            subtotal:
              (item.cantidad - 1) *
              item.precioUnitario,
            stockInsuficiente: false,
          }
        : item
    )
    .filter(item => item.cantidad > 0)
}

/**
 * Total del carrito
 */
export function calcularTotal(cart: CartItem[]) {
  return cart.reduce(
    (sum, i) => sum + i.subtotal,
    0
  )
}