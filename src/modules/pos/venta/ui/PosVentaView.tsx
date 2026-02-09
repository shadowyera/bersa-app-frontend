import React, { memo, useCallback } from 'react'

/* =====================================================
   UI POS – Vista de Venta
===================================================== */

/* ---------- Producto ---------- */
import ProductGrid from './product/ProductGrid'
import ProductoSearchInput from '@/shared/producto/ui/ProductoSearchInput'

/* ---------- Carrito ---------- */
import Cart from './cart/Cart'

/* ---------- Scanner ---------- */
import ProductScanner from './scanner/ProductScanner'

/* ---------- Cobro ---------- */
import PaymentModal from '../../Cobro/ui/PaymentModal'
import SeleccionarTipoPagoModal from '../../Cobro/ui/SeleccionarTipoPagoModal'

/* =====================================================
   Types
===================================================== */
import type {
  CartItem,
  ProductoPOS,
  TipoPago,
} from '../../domain/pos.types'
import type { EstadoCobro } from '../../Cobro/domain/cobro.types'

/* =====================================================
   Controller de cobro esperado por la UI
===================================================== */
interface CobroUIController {
  showTipoPago: boolean
  showPayment: boolean
  modoPago: TipoPago | null
  estado: EstadoCobro | null
  loading: boolean
  setEfectivo: (value: string) => void
  setDebito: (value: string) => void
  confirm: () => void
  closeAll: () => void
  selectTipoPago: (tipo: TipoPago) => void
}

/* =====================================================
   Props
===================================================== */
export interface PosVentaViewProps {
  scannerRef: React.RefObject<HTMLInputElement | null>
  onAddProduct: (producto: ProductoPOS) => void
  onFocusScanner: () => void

  query: string
  onChangeQuery: (value: string) => void
  productos: ProductoPOS[]
  stockMap: Record<string, number>
  loadingProductos: boolean

  cart: CartItem[]
  highlightedId?: string | null

  onIncrease: (productoId: string) => void
  onDecrease: (productoId: string) => void
  total: number

  bloqueado: boolean
  cargandoCaja: boolean
  onCobrar: () => void

  onClearCart: () => void

  cobro: CobroUIController
}

/* =====================================================
   PosVentaView
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

  bloqueado,
  cargandoCaja,
  onCobrar,

  onClearCart,

  cobro,
}: PosVentaViewProps) {

  /* =====================================================
     Add desde grid
  ===================================================== */
  const handleAddProductFromGrid = useCallback(
    (producto: ProductoPOS) => {
      onAddProduct(producto)
      onChangeQuery('')
      onFocusScanner()
    },
    [onAddProduct, onChangeQuery, onFocusScanner]
  )

  return (
    <>
      {/* ===============================
          Scanner (siempre activo)
      =============================== */}
      <ProductScanner
        scannerRef={scannerRef}
        onAddProduct={onAddProduct}
      />

      {/* ===============================
          Contenedor principal
      =============================== */}
      <div className="pt-3 h-[calc(100vh-7rem)]">

        <div
          className={
            bloqueado
              ? 'pointer-events-none opacity-40 h-full'
              : 'h-full'
          }
        >

          <div className="grid grid-cols-3 gap-4 h-full min-h-0">

            {/* ===============================
                PRODUCTOS
            =============================== */}
            <div className="col-span-2 flex flex-col space-y-4 min-h-0">

              <ProductoSearchInput
                autoFocus
                placeholder="Buscar producto..."
                value={query}
                onChange={onChangeQuery}
                className="w-full px-4 py-3 text-base"
              />

              <div className="flex-1 overflow-y-auto min-h-0">
                <ProductGrid
                  productos={productos}
                  stockMap={stockMap}
                  loading={loadingProductos}
                  onAddProduct={handleAddProductFromGrid}
                />
              </div>

            </div>

            {/* ===============================
                CARRITO
            =============================== */}
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

              {/* ===============================
                  BOTÓN COBRAR
              =============================== */}
              {cart.length > 0 && (
                <div className="pt-3 pb-4">
                  <button
                    disabled={bloqueado}
                    onMouseDown={e => {
                      e.preventDefault()
                      if (bloqueado) return
                      onCobrar()
                    }}
                    className={`w-full py-3 rounded text-white font-semibold transition ${
                      bloqueado
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {cargandoCaja
                      ? 'Validando caja…'
                      : 'Cobrar'}
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>

      {/* ===============================
          MODALES
      =============================== */}
      {cobro.showTipoPago && (
        <SeleccionarTipoPagoModal
          onClose={cobro.closeAll}
          onSelect={cobro.selectTipoPago}
        />
      )}

      {cobro.showPayment &&
        cobro.modoPago &&
        cobro.estado && (
          <PaymentModal
            totalVenta={total}
            modo={cobro.modoPago}
            estado={cobro.estado}
            loading={cobro.loading}
            setEfectivo={cobro.setEfectivo}
            setDebito={cobro.setDebito}
            onClose={cobro.closeAll}
            onConfirm={cobro.confirm}
          />
        )}
    </>
  )
}

export default memo(PosVentaView)