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

      {/* Grid */}
      <div
        className={`
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-5
          gap-3
          transition-opacity duration-200 ease-out
          ${loading ? 'opacity-60 pointer-events-none' : ''}
        `}
      >

        {productos.length === 0 && !loading && (
          <div className="col-span-full flex items-center justify-center py-12">
            <span className="text-sm text-muted-foreground">
              No hay productos disponibles
            </span>
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

      {/* Loading overlay suave */}
      {loading && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] pointer-events-none" />
      )}

    </div>
  )
}

export default memo(ProductGrid)