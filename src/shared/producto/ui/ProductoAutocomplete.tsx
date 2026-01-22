import { memo, useState } from 'react'
import ProductoSearchInput from './ProductoSearchInput'
import type { Producto } from '../producto.types';

interface Props {
  /**
   * Productos YA filtrados externamente
   */
  productos: Producto[]

  /**
   * Acción al seleccionar un producto
   */
  onSelect: (producto: Producto) => void
}

/**
 * ProductoAutocomplete
 *
 * Selector puntual de producto.
 * - No filtra internamente
 * - No conoce stock
 * - No conoce contexto
 * - Controla solo UI mínima
 */
function ProductoAutocomplete({
  productos,
  onSelect,
}: Props) {
  const [query, setQuery] = useState<string>('')

  const isOpen = query.trim().length > 0 && productos.length > 0

  return (
    <div className="relative space-y-2">
      {/* ===============================
          INPUT DE BÚSQUEDA
      =============================== */}
      <ProductoSearchInput
        value={query}
        autoFocus
        onChange={(q: string) => {
          setQuery(q)
        }}
      />

      {/* ===============================
          DROPDOWN
      =============================== */}
      {isOpen && (
        <div
          className="
            absolute z-50 mt-1 w-full
            max-h-64 overflow-y-auto
            rounded-xl
            border border-slate-800
            bg-slate-900 shadow-xl
          "
        >
          {productos.map(producto => (
            <button
              key={producto._id}
              type="button"
              onMouseDown={() => {
                onSelect(producto)
                setQuery('')
              }}
              className="
                flex w-full items-center justify-between
                border-b border-slate-800
                px-4 py-3 text-left
                text-sm text-slate-200
                hover:bg-slate-800
                last:border-b-0
              "
            >
              <div>
                <div className="font-medium">
                  {producto.nombre}
                </div>
                <div className="text-xs text-slate-400">
                  {producto.unidadBase}
                  {producto.codigo && ` · ${producto.codigo}`}
                </div>
              </div>

              <span className="text-xs text-emerald-400">
                Agregar
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(ProductoAutocomplete)