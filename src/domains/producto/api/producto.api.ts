import { api } from '@/shared/api/api'

import type {
  CreateProductoDTO,
  UpdateProductoDTO,
} from './producto.contracts'

/* =====================================================
   DTO Backend (lo que devuelve el server)
===================================================== */

export interface ProductoDTO {
  _id: string
  nombre: string
  descripcion?: string
  precio: number
  codigo?: string

  categoriaId?: string
  proveedorId?: string | { _id: string }

  activo: boolean
  unidadBase: string

  presentaciones?: {
    _id: string
    nombre: string
    unidades: number
    precioUnitario: number
    precioTotal: number
  }[]

  reglasPrecio?: {
    _id: string
    cantidadMinima: number
    precioUnitario: number
  }[]

  fechaVencimiento?: string
  imagenUrl?: string

  createdAt?: string
  updatedAt?: string
}

/* =====================================================
   PARAMS
===================================================== */

export interface ListarProductosParams {
  includeInactive?: boolean
  search?: string
  page?: number
  limit?: number
}

/* =====================================================
   RESPONSE
===================================================== */

export interface ListarProductosResponse {
  data: ProductoDTO[]
  page: number
  total: number
  totalPages: number
}

/* =====================================================
   Queries
===================================================== */

/**
 * Buscar producto por código (POS)
 */
export async function buscarProductoPorCodigo(
  codigo: string
): Promise<ProductoDTO | null> {
  try {
    const { data } = await api.get<ProductoDTO>(
      `/productos/buscar/${encodeURIComponent(codigo)}`
    )
    return data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Productos para POS
 * - Usa el mismo endpoint paginado
 * - Pide limit alto
 * - Solo activos
 */
export async function getProductosPOS(): Promise<ProductoDTO[]> {
  const { data } =
    await api.get<ListarProductosResponse>(
      '/productos',
      {
        params: {
          page: 1,
          limit: 1000,
          includeInactive: false,
        },
      }
    )

  return data.data
}

/**
 * Productos para Admin (paginado backend)
 */
export async function getProductosAdmin(
  params: ListarProductosParams
): Promise<ListarProductosResponse> {
  const { data } =
    await api.get<ListarProductosResponse>(
      '/productos',
      { params }
    )

  return data
}

/* =====================================================
   Mutations
===================================================== */

/**
 * Crear producto
 */
export async function createProducto(
  payload: CreateProductoDTO
): Promise<ProductoDTO> {
  const { data } =
    await api.post<ProductoDTO>(
      '/productos',
      payload
    )
  return data
}

/**
 * Actualizar producto
 */
export async function updateProducto(
  id: string,
  payload: UpdateProductoDTO
): Promise<ProductoDTO> {
  const { data } =
    await api.put<ProductoDTO>(
      `/productos/${id}`,
      payload
    )
  return data
}

/**
 * Activar / desactivar producto
 */
export async function setProductoActivo(
  id: string,
  activo: boolean
): Promise<void> {
  await api.patch(
    `/productos/${id}/activo`,
    { activo }
  )
}