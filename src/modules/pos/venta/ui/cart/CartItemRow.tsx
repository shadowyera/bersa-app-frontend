import { memo, useCallback } from 'react'
import type { CartItem } from '@/modules/pos/domain/pos.types'

interface Props {
  item: CartItem
  highlighted?: boolean
  onIncrease: (productoId: string) => void
  onDecrease: (productoId: string) => void
  onUserAction?: () => void
}

function CartItemRow({
  item,
  highlighted = false,
  onIncrease,
  onDecrease,
  onUserAction,
}: Props) {

  const handleDecrease = useCallback(() => {
    onDecrease(item.productoId)
    onUserAction?.()
  }, [item.productoId, onDecrease, onUserAction])

  const handleIncrease = useCallback(() => {
    onIncrease(item.productoId)
    onUserAction?.()
  }, [item.productoId, onIncrease, onUserAction])

  return (
    <div
      className={`
        flex justify-between items-center
        rounded px-3 py-2
        transition-all
        ${highlighted
          ? 'bg-emerald-500/20 border border-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.6)]'
          : 'bg-slate-700/60 hover:bg-slate-700'
        }
      `}
    >

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-100 truncate">
          {item.nombre}
        </div>
        <div className="text-xs text-slate-400">
          ${item.precioUnitario.toLocaleString('es-CL')}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-3">
        <button
          type="button"
          onClick={handleDecrease}
          className="w-8 h-8 rounded bg-slate-600 hover:bg-slate-500 text-slate-100 text-lg leading-none"
        >
          −
        </button>

        <span className="w-6 text-center text-sm font-semibold text-slate-100">
          {item.cantidad}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          className="w-8 h-8 rounded bg-slate-600 hover:bg-slate-500 text-slate-100 text-lg leading-none"
        >
          +
        </button>
      </div>

    </div>
  )
}

export default memo(CartItemRow)