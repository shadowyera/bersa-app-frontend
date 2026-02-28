import { memo, useCallback } from 'react'
import ProductCard from './ProductCard'

import type { Producto } from '@/domains/producto/domain/producto.types'

interface Props {
  productos: Producto[]
  stockMap: Record<string, number>
  loading: boolean
  onAddProduct: (producto: Producto) => void
  onAnyClick?: () => void
}

function ProductGrid({
  productos,
  stockMap,
  loading,
  onAddProduct,
  onAnyClick,
}: Props) {

  const handleAdd = useCallback(
    (producto: Producto) => {
      onAddProduct(producto)
      onAnyClick?.()
    },
    [onAddProduct, onAnyClick]
  )

  return (
    <div className="relative">

      <div
        className={`
          grid grid-cols-2 gap-3
          transition-opacity duration-200 ease-out
          ${loading ? 'opacity-70 pointer-events-none' : ''}
        `}
      >
        {productos.length === 0 && (
          <div className="col-span-2 text-center text-foreground/40 py-8">
            No hay productos
          </div>
        )}

        {productos.map(producto => {
          const stock = stockMap[producto.id] ?? 0

          return (
            <ProductCard
              key={producto.id}
              nombre={producto.nombre}
              precio={producto.precio}
              activo={producto.activo}
              stock={stock}
              onAdd={() => handleAdd(producto)}
            />
          )
        })}
      </div>

      {loading && (
        <div className="absolute inset-0 pointer-events-none" />
      )}
    </div>
  )
}

export default memo(ProductGrid)