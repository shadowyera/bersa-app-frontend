import { memo, useCallback } from 'react'
import ProductCard from './ProductCard'

export interface ProductoGridItem {
  _id: string
  nombre: string
  precio: number
  activo: boolean
}

interface Props {
  productos: ProductoGridItem[]
  stockMap: Record<string, number>
  loading: boolean

  /**
   * Acción de dominio (estable desde PosPage)
   */
  onAddProduct: (producto: ProductoGridItem) => void

  /**
   * Acción UX (focus scanner)
   */
  onAnyClick?: () => void
}

function ProductGrid({
  productos,
  stockMap,
  loading,
  onAddProduct,
  onAnyClick,
}: Props) {
  /* ===============================
     Estados base
  =============================== */
  if (loading) {
    return (
      <div className="text-slate-400">
        Cargando productos…
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="text-slate-500">
        No hay productos
      </div>
    )
  }

  /* ===============================
     Handler estable
     - evita closures por item
     - mantiene memo del Card
  =============================== */
  const handleAdd = useCallback(
    (producto: ProductoGridItem) => {
      onAddProduct(producto)
      onAnyClick?.()
    },
    [onAddProduct, onAnyClick]
  )

  /* ===============================
     Render
  =============================== */
  return (
    <div className="grid grid-cols-2 gap-2">
      {productos.map(p => {
        const stock = stockMap[p._id] ?? 0

        return (
          <ProductCard
            key={p._id}
            nombre={p.nombre}
            precio={p.precio}
            activo={p.activo}
            stock={stock}
            onAdd={() => handleAdd(p)}
          />
        )
      })}
    </div>
  )
}

/**
 * Memo:
 * - el grid solo rerenderiza si cambian props
 */
export default memo(ProductGrid)