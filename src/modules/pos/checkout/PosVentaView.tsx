import React, { memo, useCallback } from 'react'

/* =====================================================
   UI POS – Vista de Venta
===================================================== */

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

/* ---------- UI Base ---------- */
import { Button } from '@/shared/ui/button/button'

/* =====================================================
   Types
===================================================== */

import type { Producto } from '@/domains/producto/domain/producto.types'
import type { EstadoCobro } from '@/domains/venta/domain/cobro/cobro.types'
import type {
  DocumentoReceptor,
  DocumentoTributario,
} from '@/domains/venta/domain/venta.types'
import type { TipoPago } from '@/domains/venta/domain/pago/pago.types'
import type { CartItem } from '@/domains/venta/domain/cart-item.types'

/* =====================================================
   Pago Controller
===================================================== */

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

/* =====================================================
   Props
===================================================== */

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
  onSetReceptor: (r: DocumentoReceptor) => void

  showReceptor: boolean
  onCloseReceptor: () => void

  bloqueado: boolean
  cargandoCaja: boolean
  onCobrar: () => void
  pago: PagoUIController
}

/* =====================================================
   Component
===================================================== */

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
  onSetReceptor,

  showReceptor,
  onCloseReceptor,

  bloqueado,
  cargandoCaja,
  onCobrar,
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
      {/* ======================= SCANNER ======================= */}

      <ProductScanner
        scannerRef={scannerRef}
        onAddProduct={onAddProduct}
      />

      {/* ======================= CUERPO ======================= */}

      <div className="pt-2 h-[calc(100vh-6.5rem)]">

        <div
          className={
            bloqueado
              ? 'pointer-events-none opacity-40 h-full transition-opacity'
              : 'h-full'
          }
        >

          <div className="grid grid-cols-3 gap-3 h-full min-h-0">

            {/* ======================= IZQUIERDA ======================= */}

            <div className="col-span-2 flex flex-col gap-3 min-h-0">

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

            {/* ======================= DERECHA ======================= */}

            <div className="flex flex-col h-full min-h-0">

              <div className="flex-1 overflow-hidden min-h-0">
                <Cart
                  items={cart}
                  highlightedId={highlightedId}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onUserAction={onFocusScanner}
                  onClear={onClearCart}
                />
              </div>

              {cart.length > 0 && (
                <div className="pt-2 pb-3 space-y-2">

                  {/* Documento */}
                  <div className="flex gap-2">

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

                  {/* Cobrar */}
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full"
                    disabled={bloqueado}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      if (bloqueado) return
                      onCobrar()
                    }}
                  >
                    {cargandoCaja
                      ? 'Validando caja…'
                      : 'Cobrar (F2)'}
                  </Button>

                </div>
              )}

            </div>

          </div>
        </div>
      </div>

      {/* ======================= MODALES ======================= */}

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