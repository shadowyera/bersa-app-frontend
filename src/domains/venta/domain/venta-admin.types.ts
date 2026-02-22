export type VentaEstado = 'FINALIZADA' | 'ANULADA'

export interface VentaAdmin {
  id: string

  folio: string

  numeroVenta: number

  aperturaCajaId: string

  total: number
  totalCobrado: number

  estado: VentaEstado

  documentoTributario: {
    tipo: 'BOLETA' | 'FACTURA'
  }

  pagos: {
    tipo: string
    monto: number
  }[]

  usuarioId: string
  cajaId: string
  sucursalId: string

  createdAt: string
}

export interface VentaAdminDetalle {
  id: string

  folio: string

  numeroVenta: number

  estado: VentaEstado

  usuarioId: string
  cajaId: string
  sucursalId: string

  documentoTributario: {
    tipo: 'BOLETA' | 'FACTURA'
    receptor?: {
      rut: string
      razonSocial: string
      giro: string
      direccion: string
      comuna: string
      ciudad: string
    }
  }

  total: number
  ajusteRedondeo: number
  totalCobrado: number
  createdAt: string

  items: {
    productoId: string
    nombre: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }[]

  pagos: {
    tipo: string
    monto: number
  }[]
}