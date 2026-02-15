export interface ReceptorFactura {
  rut: string
  razonSocial: string
  giro?: string
  direccion?: string
  comuna?: string
  ciudad?: string
}

export interface FacturaItemInput {
  descripcion: string
  cantidad: number
  precioUnitario: number
}

export interface CrearFacturaInput {
  ventaId: string
  receptor: ReceptorFactura
  items?: FacturaItemInput[]
  aplicarIva?: boolean
  ivaRate?: number
}

export interface Factura {
  _id: string
  ventaId: string
  folio: string
  receptor: ReceptorFactura
  neto: number
  iva: number
  total: number
  estado: string
  createdAt: string
}