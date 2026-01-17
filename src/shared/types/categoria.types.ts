// categoria.types.ts

export type TipoCategoria =
  | 'NORMAL'
  | 'ALCOHOL'
  | 'SERVICIO'
  | 'PROMO'

// 👉 lo que RECIBES del backend
export interface Categoria {
  _id: string
  nombre: string
  descripcion: string
  activo: boolean
  orden: number
  color?: string
  tipo: TipoCategoria
  createdAt: string
  updatedAt: string
}

// 👉 lo que ENVÍAS al crear
export interface CreateCategoriaDTO {
  nombre: string
  tipo: TipoCategoria
  descripcion?: string
  color?: string
}

// 👉 lo que ENVÍAS al editar
export interface UpdateCategoriaDTO {
  nombre?: string
  tipo?: TipoCategoria
  descripcion?: string
  color?: string
}