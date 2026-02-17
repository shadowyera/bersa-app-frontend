import { memo } from 'react'
import type { Producto } from '@/domains/producto/domain/producto.types'

interface Props {
  /**
   * Productos YA filtrados externamente.
   * El picker NO busca ni filtra.
   */
  products: Producto[]

  /**
   * Acción al seleccionar un producto.
   */
  onSelect: (producto: Producto) => void
}

/**
 * ProductoPicker (Abastecimiento)
 *
 * Responsabilidad ÚNICA:
 * - Mostrar lista de productos
 * - Permitir seleccionar uno
 *
 * NO hace:
 * - búsqueda
 * - filtrado
 * - fetch
 * - manejo de estado
 */
function ProductoPicker({
  products,
  onSelect,
}: Props) {
  if (!products.length) return null

  return (
    <div
      className="
        mt-2 max-h-64 overflow-y-auto
        rounded-xl border border-slate-800
        bg-slate-900 shadow-xl
      "
    >
      {products.map(producto => (
        <button
          key={producto.id}
          type="button"
          onMouseDown={() => onSelect(producto)}
          className="
            flex w-full items-center justify-between
            border-b border-slate-800
            px-4 py-3 text-left
            text-sm text-slate-200
            hover:bg-slate-800
            last:border-b-0
          "
        >
          <div className="flex flex-col">
            <span className="font-medium">
              {producto.nombre}
            </span>

            <span className="text-xs text-slate-400">
              {producto.codigo ?? 'Sin código'}
            </span>
          </div>

          <span className="text-xs text-emerald-400">
            Agregar
          </span>
        </button>
      ))}
    </div>
  )
}

export default memo(ProductoPicker)