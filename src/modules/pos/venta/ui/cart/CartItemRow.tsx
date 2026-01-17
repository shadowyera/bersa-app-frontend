import { memo } from 'react'
import type { CartItem } from '@/modules/pos/pos.types'

interface Props {
  item: CartItem
  onIncrease: (productoId: string) => void
  onDecrease: (productoId: string) => void
  onUserAction?: () => void
}

/**
 * Fila individual del carrito
 *
 * - Componente PURO
 * - Memoizado
 */
function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onUserAction,
}: Props) {
  return (
    <div className="flex justify-between items-center bg-slate-700/60 hover:bg-slate-700 transition rounded px-3 py-2">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-100 truncate">
          {item.nombre}
        </div>
        <div className="text-xs text-slate-400">
          ${item.precioUnitario.toLocaleString()}
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-2 ml-3">
        <button
          onMouseDown={e => {
            e.preventDefault()
            onDecrease(item.productoId)
            onUserAction?.()
          }}
          className="w-8 h-8 rounded bg-slate-600 hover:bg-slate-500 text-slate-100 text-lg leading-none"
        >
          −
        </button>

        <span className="w-6 text-center text-sm font-semibold text-slate-100">
          {item.cantidad}
        </span>

        <button
          onMouseDown={e => {
            e.preventDefault()
            onIncrease(item.productoId)
            onUserAction?.()
          }}
          className="w-8 h-8 rounded bg-slate-600 hover:bg-slate-500 text-slate-100 text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default memo(CartItemRow)