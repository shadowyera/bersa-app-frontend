import { memo, useCallback, useEffect, useRef, useState } from 'react'
import CartItemRow from './CartItemRow';
import ConfirmModal from '@/shared/ui/ConfirmModal'
import type { CartItem } from '../../domain/pos.types'
import { useCartSummary } from './useCartSummary';

interface Props {
  items: CartItem[]
  highlightedId?: string | null
  onIncrease: (productoId: string) => void
  onDecrease: (productoId: string) => void
  onClear?: () => void
  onUserAction?: () => void
}

function Cart({
  items,
  highlightedId,
  onIncrease,
  onDecrease,
  onClear,
  onUserAction,
}: Props) {

  const {
    total,
    hayStockInsuficiente,
    cantidadItems,
  } = useCartSummary(items)

  /* ===============================
     Refs
  =============================== */

  const listRef = useRef<HTMLDivElement | null>(null)

  /* ===============================
     Auto-scroll al agregar ítem
  =============================== */

  useEffect(() => {
    if (!listRef.current) return

    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [items.length])

  /* ===============================
     Confirm modal state
  =============================== */

  const [confirmOpen, setConfirmOpen] = useState(false)

  const openConfirm = useCallback(() => {
    if (!onClear) return
    setConfirmOpen(true)
  }, [onClear])

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false)
  }, [])

  const confirmClear = useCallback(() => {
    if (!onClear) return
    onClear()
    setConfirmOpen(false)
  }, [onClear])

  return (
    <>
      <div className="bg-slate-800 rounded-lg p-4 flex flex-col h-full">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-100">
            Carrito
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {cantidadItems} ítem
              {cantidadItems !== 1 && 's'}
            </span>

            {items.length > 0 && (
              <button
                type="button"
                onClick={openConfirm}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Warning stock */}
        {hayStockInsuficiente && (
          <div className="shrink-0 mb-3 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1">
            ⚠ El stock del sistema puede no reflejar la realidad.
            Se permite vender igualmente.
          </div>
        )}

        {/* Items */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto space-y-2 pr-1"
        >
          {items.length === 0 && (
            <div className="text-sm text-slate-400 text-center mt-6">
              No hay productos en el carrito
            </div>
          )}

          {items.map(item => (
            <CartItemRow
              key={item.productoId}
              item={item}
              highlighted={item.productoId === highlightedId}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onUserAction={onUserAction}
            />
          ))}
        </div>

        {/* Total */}
        <div className="shrink-0 border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
          <span className="text-sm text-slate-300">
            Total
          </span>

          <span className="text-xl font-bold text-emerald-400">
            ${total.toLocaleString('es-CL')}
          </span>
        </div>

      </div>

      {/* Confirm modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Vaciar carrito"
        description="¿Seguro que deseas eliminar todos los productos del carrito?"
        confirmText="Vaciar"
        cancelText="Cancelar"
        onConfirm={confirmClear}
        onCancel={closeConfirm}
      />
    </>
  )
}

export default memo(Cart)