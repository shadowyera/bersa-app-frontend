import { useMemo, useDeferredValue } from 'react'
import { useProductosPOS } from '@/shared/queries/useProductos'
import { useStockSucursal } from '@/shared/hooks/useStockSucursal'
import type { ProductoPOS } from '../pos.types'

/**
 * Hook de lectura de productos para el POS.
 *
 * - Combina catálogo + stock
 * - Aplica búsqueda (solo UI)
 * - No muta estado ni conoce venta
 */
export function usePosProductos(
  sucursalId: string,
  query: string
) {
  /* ===============================
     Catálogo de productos
  =============================== */
  const {
    data: productosCatalogo = [],
    isLoading: loadingProductos,
  } = useProductosPOS()

  const productosTyped =
    productosCatalogo as ProductoPOS[]

  /* ===============================
     Stock por sucursal
  =============================== */
  const {
    stock: stockMap,
    loading: loadingStock,
  } = useStockSucursal(sucursalId)

  /* ===============================
     Búsqueda diferida (UX)
  =============================== */
  const deferredQuery = useDeferredValue(query)

  const productosFiltrados = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    if (!q) return productosTyped

    return productosTyped.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.codigo?.includes(deferredQuery)
    )
  }, [productosTyped, deferredQuery])

  return {
    productos: productosFiltrados,
    stockMap,
    loading: loadingProductos || loadingStock,
  }
}