import { useMemo, useDeferredValue } from 'react'

import { useProductosPOS } from '@/shared/queries/useProductos'
import { useStockSucursal } from '@/shared/hooks/useStockSucursal'
import { useAuth } from '@/modules/auth/useAuth'

import type { ProductoPOS } from '../pos.types'

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
  const sucursalId = user?.sucursalId

  /* ===============================
     Catálogo de productos
  =============================== */
  const {
    data: productosCatalogo = [],
    isLoading: loadingProductos,
  } = useProductosPOS()

  const productos =
    productosCatalogo as ProductoPOS[]

  /* ===============================
     Stock por sucursal activa
  =============================== */
  const {
    stock: stockMap,
    loading: loadingStock,
  } = useStockSucursal(sucursalId)

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