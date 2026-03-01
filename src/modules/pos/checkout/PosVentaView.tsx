import React, { memo, useCallback } from 'react'

/* ---------- Producto ---------- */
import ProductGrid from './product/ProductGrid'
import ProductoSearchInput from '@/domains/producto/ui/ProductoSearchInput'

/* ---------- Carrito ---------- */
import Cart from '../cart/ui/Cart'

/* ---------- Scanner ---------- */
import ProductScanner from '../scanner/ui/ProductScanner'

/* ---------- Pago ---------- */
import PaymentModal from '../pago/ui/PaymentModal'
import SeleccionarTipoPagoModal from '../pago/ui/SeleccionarTipoPagoModal'

/* ---------- Documento ---------- */
import DocumentoReceptorModal from './documento/DocumentoReceptorModal'

/* ---------- Types ---------- */
import type { Producto } from '@/domains/producto/domain/producto.types'
import type { EstadoCobro } from '@/domains/venta/domain/cobro/cobro.types'
import type {
  DocumentoReceptor,
  DocumentoTributario,
} from '@/domains/venta/domain/venta.types'
import type { TipoPago } from '@/domains/venta/domain/pago/pago.types'
import type { CartItem } from '@/domains/venta/domain/cart-item.types'

interface PagoUIController {
  showTipoPago: boolean
  showPayment: boolean
  modoPago: TipoPago | null
  estado: EstadoCobro | null
  loading: boolean
  efectivoRaw: string
  debitoRaw: string
  setEfectivo: (value: string) => void
  setDebito: (value: string) => void
  addMontoRapido: (monto: number) => void
  deleteLastDigit: () => void
  confirm: () => void
  closeAll: () => void
  backToTipoPago: () => void
  selectTipoPago: (tipo: TipoPago) => void
}

export interface PosVentaViewProps {
  scannerRef: React.RefObject<HTMLInputElement | null>
  onAddProduct: (producto: Producto) => void
  onFocusScanner: () => void

  query: string
  onChangeQuery: (value: string) => void
  productos: Producto[]
  stockMap: Record<string, number>
  loadingProductos: boolean

  cart: CartItem[]
  highlightedId?: string | null
  onIncrease: (productoId: string) => void
  onDecrease: (productoId: string) => void
  total: number
  onClearCart: () => void

  documentoTributario: DocumentoTributario
  onSetTipoDocumento: (tipo: 'BOLETA' | 'FACTURA') => void

  bloqueado: boolean
  cargandoCaja: boolean
  onCobrar: () => void

  showReceptor: boolean
  onCloseReceptor: () => void
  onSetReceptor: (r: DocumentoReceptor) => void

  pago: PagoUIController
}

function PosVentaView({
  scannerRef,
  onAddProduct,
  onFocusScanner,
  query,
  onChangeQuery,
  productos,
  stockMap,
  loadingProductos,
  cart,
  highlightedId,
  onIncrease,
  onDecrease,
  total,
  onClearCart,
  documentoTributario,
  onSetTipoDocumento,
  bloqueado,
  cargandoCaja,
  onCobrar,
  showReceptor,
  onCloseReceptor,
  onSetReceptor,
  pago,
}: PosVentaViewProps) {

  const handleAddProductFromGrid = useCallback(
    (producto: Producto) => {
      onAddProduct(producto)
      onChangeQuery('')
      onFocusScanner()
    },
    [onAddProduct, onChangeQuery, onFocusScanner]
  )

  return (
    <>
      <ProductScanner scannerRef={scannerRef} onAddProduct={onAddProduct} />

      <div className="pt-2 flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-[2fr_1fr] gap-4 flex-1 min-h-0">

          {/* IZQUIERDA */}
          <div className="flex flex-col gap-3 min-h-0">
            <ProductoSearchInput
              autoFocus
              placeholder="Buscar producto..."
              value={query}
              onChange={onChangeQuery}
              className="w-full px-3 py-2.5 text-sm"
            />

            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              <ProductGrid
                productos={productos}
                stockMap={stockMap}
                loading={loadingProductos}
                onAddProduct={handleAddProductFromGrid}
              />
            </div>
          </div>

          {/* DERECHA — TODO controlado por Cart */}
          <div className="flex flex-col h-[calc(100vh-140px)]">
            <Cart
              items={cart}
              highlightedId={highlightedId}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onClear={onClearCart}
              total={total}
              documentoTributario={documentoTributario}
              onSetTipoDocumento={onSetTipoDocumento}
              onCobrar={onCobrar}
              bloqueado={bloqueado}
              cargandoCaja={cargandoCaja}
            />
          </div>
        </div>
      </div>

      {pago.showTipoPago && (
        <SeleccionarTipoPagoModal
          onClose={pago.closeAll}
          onSelect={pago.selectTipoPago}
        />
      )}

      {pago.showPayment &&
        pago.modoPago &&
        pago.estado && (
          <PaymentModal
            totalVenta={total}
            modo={pago.modoPago}
            estado={pago.estado}
            loading={pago.loading}
            efectivoRaw={pago.efectivoRaw}
            debitoRaw={pago.debitoRaw}
            setEfectivo={pago.setEfectivo}
            setDebito={pago.setDebito}
            onClose={pago.closeAll}
            onConfirm={pago.confirm}
          />
        )}

      <DocumentoReceptorModal
        open={showReceptor}
        onClose={onCloseReceptor}
        onConfirm={onSetReceptor}
      />
    </>
  )
}

export default memo(PosVentaView)