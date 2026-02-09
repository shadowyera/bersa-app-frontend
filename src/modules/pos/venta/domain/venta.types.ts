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