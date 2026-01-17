import { buscarProductoPorCodigo } from "@/modules/pos/pos.api"

/**
 * Resultado de escaneo válido para el POS
 * (UI-friendly, no dominio de venta)
 */
export interface ProductoEscaneado {
  _id: string
  nombre: string
  precio: number
  codigo?: string
  activo: boolean
  categoriaId?: string
}

/**
 * Hook responsable de:
 * - Buscar producto por código
 * - Validar estado
 * - Lanzar errores semánticos
 */
export function useScanProduct() {
  const scan = async (
    code: string
  ): Promise<ProductoEscaneado> => {
    const producto =
      await buscarProductoPorCodigo(code)

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