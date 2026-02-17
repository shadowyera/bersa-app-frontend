import type { CartItem } from "../cart-item.types"
import type { ProductoVendible } from '../venta.types'

/* ===============================
   Helpers internos
=============================== */

function calcularSubtotal(
  cantidad: number,
  precioUnitario: number
) {
  return cantidad * precioUnitario
}

function hayStockInsuficiente(
  cantidad: number,
  stock?: number
) {
  return stock !== undefined && cantidad > stock
}

/* ===============================
   Agregar producto
=============================== */

export function agregarProducto(
  cart: CartItem[],
  producto: ProductoVendible
): CartItem[] {

  let encontrado = false

  const nuevoCart = cart.map(item => {

    if (item.productoId !== producto.productoId)
      return item

    encontrado = true

    const cantidad = item.cantidad + 1

    return {
      ...item,
      cantidad,
      subtotal: calcularSubtotal(
        cantidad,
        item.precioUnitario
      ),
      stockInsuficiente: hayStockInsuficiente(
        cantidad,
        producto.stockDisponible
      ),
    }
  })

  if (encontrado) return nuevoCart

  return [
    ...cart,
    {
      productoId: producto.productoId,
      nombre: producto.nombre,
      precioUnitario: producto.precioUnitario,
      cantidad: 1,
      subtotal: producto.precioUnitario,
      stockInsuficiente: hayStockInsuficiente(
        1,
        producto.stockDisponible
      ),
    },
  ]
}

/* ===============================
   Aumentar cantidad
=============================== */

export function aumentarCantidad(
  cart: CartItem[],
  productoId: string
): CartItem[] {

  return cart.map(item => {

    if (item.productoId !== productoId)
      return item

    const cantidad = item.cantidad + 1

    return {
      ...item,
      cantidad,
      subtotal: calcularSubtotal(
        cantidad,
        item.precioUnitario
      ),
      stockInsuficiente: hayStockInsuficiente(
        cantidad,
        item.stockDisponible
      ),
    }
  })
}

/* ===============================
   Disminuir cantidad
=============================== */

export function disminuirCantidad(
  cart: CartItem[],
  productoId: string
): CartItem[] {

  return cart
    .map(item => {

      if (item.productoId !== productoId)
        return item

      const cantidad = item.cantidad - 1

      return {
        ...item,
        cantidad,
        subtotal: calcularSubtotal(
          cantidad,
          item.precioUnitario
        ),
        stockInsuficiente: false,
      }
    })
    .filter(item => item.cantidad > 0)
}

/* ===============================
   Total carrito
=============================== */

export function calcularTotal(
  cart: CartItem[]
) {
  return cart.reduce(
    (total, item) => total + item.subtotal,
    0
  )
}