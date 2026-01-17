import CartItemRow from './CartItemRow'
import { useCartSummary } from './useCartSummary'
import type { CartItem } from '../../../pos.types';

interface Props {
  items: CartItem[]
  onIncrease: (productoId: string) => void
  onDecrease: (productoId: string) => void
  onUserAction?: () => void
}

/**
 * Cart
 *
 * Responsabilidad:
 * - Layout
 * - Composición de UI
 *
 * ❗ NO calcula lógica
 * ❗ NO maneja reglas de negocio
 */
export default function Cart({
  items,
  onIncrease,
  onDecrease,
  onUserAction,
}: Props) {
  /* ===============================
     Derivados (hook)
  =============================== */
  const {
    total,
    hayStockInsuficiente,
    cantidadItems,
  } = useCartSummary(items)

  return (
    <div className="bg-slate-800 rounded-lg p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-slate-100">
          Carrito
        </h2>

        <span className="text-xs text-slate-400">
          {cantidadItems} ítem
          {cantidadItems !== 1 && 's'}
        </span>
      </div>

      {/* Alerta global */}
      {hayStockInsuficiente && (
        <div className="mb-3 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1">
          ⚠ El stock del sistema puede no reflejar la
          realidad. Se permite vender igualmente.
        </div>
      )}

      {/* Lista */}
      <div className="flex-1 overflow-auto space-y-2">
        {items.length === 0 && (
          <div className="text-sm text-slate-400 text-center mt-6">
            No hay productos en el carrito
          </div>
        )}

        {items.map(item => (
          <CartItemRow
            key={item.productoId}
            item={item}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onUserAction={onUserAction}
          />
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
        <span className="text-sm text-slate-300">
          Total
        </span>
        <span className="text-xl font-bold text-emerald-400">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  )
}