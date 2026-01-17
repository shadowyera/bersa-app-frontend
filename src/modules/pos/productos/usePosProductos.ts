import { useMemo, useDeferredValue } from 'react'
import { useProductosPOS } from '@/shared/queries/useProductos'
import { useStockSucursal } from '@/shared/hooks/useStockSucursal'
import type { ProductoPOS } from '../pos.types'

/**
 * Hook de lectura para el POS
 *
 * - NO muta estado
 * - NO maneja venta
 * - Solo compone datos existentes
 */
export function usePosProductos(
  sucursalId: string,
  query: string
) {
  /* ===============================
     Catálogo (React Query)
  =============================== */
  const {
    data: productosCatalogo = [],
    isLoading: loadingProductos,
  } = useProductosPOS()

  const productosCatalogoTyped = productosCatalogo as ProductoPOS[]

  /* ===============================
     Stock normalizado (ya existente)
  =============================== */
  const {
    stock: stockMap,
    loading: loadingStock,
  } = useStockSucursal(sucursalId)

  /* ===============================
     Búsqueda diferida (solo UI)
  =============================== */
  const deferredQuery = useDeferredValue(query)

  const productosFiltrados = useMemo(() => {
    const q = deferredQuery.toLowerCase()

    if (!q) return productosCatalogoTyped

    return productosCatalogoTyped.filter(
      p =>
        p.nombre.toLowerCase().includes(q) ||
        p.codigo?.includes(deferredQuery)
    )
  }, [productosCatalogo, deferredQuery])

  return {
    productos: productosFiltrados,
    stockMap,
    loading: loadingProductos || loadingStock,
  }
}