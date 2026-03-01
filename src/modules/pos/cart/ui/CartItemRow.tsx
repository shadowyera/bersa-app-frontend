import { memo, useCallback } from 'react'
import type { CartItem } from '@/domains/venta/domain/cart-item.types'

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
        rounded-lg px-4 py-2
        border transition-all duration-150
        ${
          highlighted
            ? 'bg-primary/10 border-primary/40'
            : 'bg-background border-border hover:bg-surface'
        }
      `}
    >

      {/* Información producto */}
      <div className="flex-1 min-w-0">

        <div className="text-sm font-medium text-foreground truncate">
          {item.nombre}
        </div>

        <div className="text-xs text-muted-foreground">
          ${item.precioUnitario.toLocaleString('es-CL')}
        </div>

      </div>

      {/* Stepper compacto */}
      <div className="ml-4">
        <QuantityStepper
          value={item.cantidad}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      </div>

    </div>
  )
}

export default memo(CartItemRow)

/* =====================================================
   Quantity Stepper – Compact POS Version
===================================================== */

interface QuantityStepperProps {
  value: number
  onIncrease: () => void
  onDecrease: () => void
}

function QuantityStepper({
  value,
  onIncrease,
  onDecrease,
}: QuantityStepperProps) {

  return (
    <div
      className="
        inline-flex items-center
        border border-border
        rounded-md
        bg-background
        overflow-hidden
      "
    >

      {/* Decrease */}
      <button
        type="button"
        onClick={onDecrease}
        className="
          w-8 h-8
          flex items-center justify-center
          text-sm font-medium
          text-foreground
          hover:bg-surface
          active:bg-primary/10
          transition-colors
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary/40
        "
      >
        −
      </button>

      {/* Value */}
      <div
        className="
          min-w-[36px]
          h-8
          px-2
          flex items-center justify-center
          text-sm font-semibold
          border-x border-border
          bg-surface
          text-foreground
        "
      >
        {value}
      </div>

      {/* Increase */}
      <button
        type="button"
        onClick={onIncrease}
        className="
          w-8 h-8
          flex items-center justify-center
          text-sm font-medium
          text-foreground
          hover:bg-surface
          active:bg-primary/10
          transition-colors
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary/40
        "
      >
        +
      </button>

    </div>
  )
}