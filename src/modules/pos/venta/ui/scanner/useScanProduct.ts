import { buscarProductoPorCodigo } from '@/modules/pos/pos.api'

export interface ProductoEscaneado {
  _id: string
  nombre: string
  precio: number
  codigo?: string
  activo: boolean
  categoriaId?: string
}

/**
 * Hook para procesar un código escaneado.
 *
 * - Busca el producto por código
 * - Valida que exista y esté activo
 * - Lanza errores semánticos para la UI
 */
export function useScanProduct() {
  const scan = async (
    code: string
  ): Promise<ProductoEscaneado> => {
    const producto = await buscarProductoPorCodigo(
      code
    )

    if (!producto) {
      throw new Error('NOT_FOUND')
    }

    if (!producto.activo) {
      throw new Error('INACTIVE')
    }

    return {
      _id: producto._id,
      nombre: producto.nombre,
      precio: producto.precio,
      codigo: producto.codigo,
      activo: producto.activo,
      categoriaId: producto.categoriaId,
    }
  }

  return { scan }
}