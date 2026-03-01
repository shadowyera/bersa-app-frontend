import { useMemo, useDeferredValue } from 'react'

import { useProductosPOSQuery } from '@/domains/producto/hooks/useProductosQuery'
import { useStockSucursalQuery } from '@/domains/stock/hooks/useStockSucursalQuery'
import { useAuth } from '@/modules/auth/useAuth'

import type { Producto } from '@/domains/producto/domain/producto.types'

/**
 * =====================================================
 * usePosProductos
 *
 * Hook de lectura de productos para el POS.
 *
 * Responsabilidades:
 * - Obtener catálogo de productos
 * - Obtener stock de la sucursal activa
 * - Aplicar búsqueda (solo UI)
 *
 * ✔ No muta estado
 * ✔ No conoce venta
 * ✔ No recibe sucursal por parámetro
 * =====================================================
 */
export function usePosProductos(query: string) {

  const { user } = useAuth()
  const sucursalId = user?.sucursal.id

  /* ===============================
     Catálogo de productos
  =============================== */

  const {
    data: productosCatalogo = [],
    isLoading: loadingProductos,
  } = useProductosPOSQuery()

  // Cast controlado mientras no refactorizamos dominio
  const productos = productosCatalogo as Producto[]

  /* ===============================
     Stock por sucursal activa
  =============================== */

  const {
    stock: stockMap,
    loading: loadingStock,
  } = useStockSucursalQuery(sucursalId)

  /* ===============================
     Búsqueda diferida (UX)
  =============================== */

  const deferredQuery = useDeferredValue(query)

  /* ===============================
     Filtrado optimizado
  =============================== */

  const productosFiltrados = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()

    if (!q) return productos

    return productos.filter(p => {

      if (p.nombre.toLowerCase().includes(q)) {
        return true
      }

      if (
        p.codigo &&
        p.codigo.toLowerCase().includes(q)
      ) {
        return true
      }

      return false
    })
  }, [productos, deferredQuery])

  return {
    productos: productosFiltrados,
    stockMap,
    loading: loadingProductos || loadingStock,
  }
}