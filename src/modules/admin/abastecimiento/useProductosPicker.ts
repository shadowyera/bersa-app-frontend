import { useProductosAdmin } from '@/shared/queries/useProductos'
import { useStockSucursal } from '@/shared/hooks/useStockSucursal'
import type { Producto } from '@/shared/types/producto.types'

export interface ProductoPickerItem {
  id: string
  nombre: string
  codigo?: string
  stock: number
}

export function useProductosPicker(sucursalId: string) {
  const {
    data: catalogo = [],
    isLoading: loadingCatalogo,
  } = useProductosAdmin()

  const {
    stock,
    loading: loadingStock,
  } = useStockSucursal(sucursalId)

  const productos: ProductoPickerItem[] = catalogo.map(
    (p: Producto) => ({
      id: p._id,
      nombre: p.nombre,
      codigo: p.codigo,
      stock: stock[p._id] ?? 0,
    })
  )

  return {
    productos,
    loading: loadingCatalogo || loadingStock,
  }
}