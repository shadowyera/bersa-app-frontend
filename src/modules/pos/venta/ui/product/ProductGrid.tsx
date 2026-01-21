import { memo, useCallback } from 'react'
import ProductCard from './ProductCard'
import type { ProductoPOS } from '@/modules/pos/pos.types'

interface Props {
  productos: ProductoPOS[]
  stockMap: Record<string, number>
  loading: boolean

  onAddProduct: (producto: ProductoPOS) => void
  onAnyClick?: () => void
}

/**
 * =====================================================
 * ProductGrid
 *
 * - Renderiza SIEMPRE el grid (nunca se desmonta)
 * - loading es SOLO visual / UX
 * - Evita parpadeos post-cobro
 * - Optimizado para muchos productos
 * =====================================================
 */
function ProductGrid({
  productos,
  stockMap,
  loading,
  onAddProduct,
  onAnyClick,
}: Props) {
  /**
   * Handler estable:
   * - no se recrea por producto
   * - mantiene memoización de ProductCard
   */
  const handleAdd = useCallback(
    (producto: ProductoPOS) => {
      onAddProduct(producto)
      onAnyClick?.()
    },
    [onAddProduct, onAnyClick]
  )

  return (
    <div className="relative">
      {/* ===============================
          Grid de productos (SIEMPRE)
      =============================== */}
      <div
        className={`
          grid grid-cols-2 gap-2
          transition-opacity duration-150
          ${loading ? 'opacity-70 pointer-events-none' : ''}
        `}
      >
        {productos.length === 0 && (
          <div className="col-span-2 text-center text-slate-500 py-6">
            No hay productos
          </div>
        )}

        {productos.map(producto => {
          const stock = stockMap[producto._id] ?? 0

          return (
            <ProductCard
              key={producto._id}
              nombre={producto.nombre}
              precio={producto.precio}
              activo={producto.activo}
              stock={stock}
              onAdd={() => handleAdd(producto)}
            />
          )
        })}
      </div>

      {/* ===============================
          Loading silencioso (UX)
      =============================== */}
      {loading && (
        <div className="absolute inset-0 pointer-events-none" />
      )}
    </div>
  )
}

export default memo(ProductGrid)