export interface StockProducto {
  _id: string

  productoId: {                 // 👈 CLAVE
    _id: string
    nombre: string
    codigo: string

    categoriaId?: {
      _id: string
      nombre: string
    }

    proveedorId?: {
      _id: string
      nombre: string
    }

    activo: boolean
  }

  cantidad: number
  habilitado: boolean
}

export interface Sucursal {
  _id: string
  nombre: string
}

export interface Categoria {
  _id: string
  nombre: string
}

export interface Proveedor {
  _id: string
  nombre: string
}