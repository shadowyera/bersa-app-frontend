import { useStockSucursalQuery } from '@/domains/stock/hooks/useStockSucursalQuery';
import { useProductosAdmin } from '@/domains/producto/hooks/useProductosQuery'
import type { Producto } from '@/domains/producto/domain/producto.types'

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
  } = useStockSucursalQuery(sucursalId)

  const productos: ProductoPickerItem[] = catalogo.map(
    (p: Producto) => ({
      id: p.id,
      nombre: p.nombre,
      codigo: p.codigo,
      stock: stock[p.id] ?? 0,
    })
  )

  return {
    productos,
    loading: loadingCatalogo || loadingStock,
  }
}