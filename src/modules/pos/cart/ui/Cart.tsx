import { memo, useEffect, useRef } from 'react'
import { Button } from '@/shared/ui/button/button'
import CartItemRow from './CartItemRow'

import type { CartItem } from '@/domains/venta/domain/cart-item.types'
import type { DocumentoTributario } from '@/domains/venta/domain/venta.types'

interface Props {
  items: CartItem[]
  highlightedId?: string | null
  onIncrease: (productoId: string) => void
  onDecrease: (productoId: string) => void
  onClear?: () => void

  total: number
  documentoTributario: DocumentoTributario
  onSetTipoDocumento: (tipo: 'BOLETA' | 'FACTURA') => void

  onCobrar: () => void
  bloqueado: boolean
  cargandoCaja: boolean
}

function Cart({
  items,
  highlightedId,
  onIncrease,
  onDecrease,
  onClear,
  total,
  documentoTributario,
  onSetTipoDocumento,
  onCobrar,
  bloqueado,
  cargandoCaja,
}: Props) {

  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!listRef.current) return

    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [items.length])

  return (
    <div className="bg-surface rounded-xl border border-border p-4 flex flex-col flex-1 min-h-0">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Carrito</h2>

        {items.length > 0 && onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Limpiar
          </Button>
        )}
      </div>

      {/* LISTA SCROLL */}
      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1"
      >
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground text-center mt-6">
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
          />
        ))}
      </div>

      {/* TOTAL */}
      {items.length > 0 && (
        <div className="mt-3 border rounded-lg px-4 py-3 flex justify-between items-center">
          <span className="text-sm uppercase tracking-wide">
            Total
          </span>
          <span className="text-3xl font-bold text-primary">
            ${total.toLocaleString('es-CL')}
          </span>
        </div>
      )}

      {/* TIPO DOCUMENTO */}
      {items.length > 0 && (
        <div className="mt-3 flex gap-2">
          <Button
            variant={
              documentoTributario.tipo === 'BOLETA'
                ? 'primary'
                : 'secondary'
            }
            size="sm"
            className="flex-1"
            onClick={() => onSetTipoDocumento('BOLETA')}
          >
            Boleta
          </Button>

          <Button
            variant={
              documentoTributario.tipo === 'FACTURA'
                ? 'primary'
                : 'secondary'
            }
            size="sm"
            className="flex-1"
            onClick={() => onSetTipoDocumento('FACTURA')}
          >
            Factura
          </Button>
        </div>
      )}

      {/* COBRAR */}
      {items.length > 0 && (
        <Button
          size="lg"
          variant="primary"
          className="w-full mt-3 text-base font-semibold"
          disabled={bloqueado}
          onMouseDown={(e) => {
            e.preventDefault()
            if (bloqueado) return
            onCobrar()
          }}
        >
          {cargandoCaja ? 'Validando caja…' : 'Cobrar (F2)'}
        </Button>
      )}
    </div>
  )
}

export default memo(Cart)