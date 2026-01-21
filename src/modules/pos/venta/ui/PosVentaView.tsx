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
} from '../../pos.types'
import type { EstadoCobro } from '../../Cobro/domain/cobro.types'

/**
 * Controller de cobro esperado por la UI.
 * (derivado de useCobroPOS)
 */
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

export interface PosVentaViewProps {
  /* ===============================
     Scanner
  =============================== */
  scannerRef: React.RefObject<HTMLInputElement | null>
  onAddProduct: (producto: ProductoPOS) => void
  onFocusScanner: () => void

  /* ===============================
     Productos / Búsqueda
  =============================== */
  query: string
  onChangeQuery: (value: string) => void
  productos: ProductoPOS[]
  stockMap: Record<string, number>
  loadingProductos: boolean

  /* ===============================
     Venta / Carrito
  =============================== */
  cart: CartItem[]
  onIncrease: (productoId: string) => void
  onDecrease: (productoId: string) => void
  total: number

  /* ===============================
     Caja / UX
  =============================== */
  bloqueado: boolean
  cargandoCaja: boolean
  onCobrar: () => void

  /* ===============================
     Cobro
  =============================== */
  cobro: CobroUIController
}

/**
 * =====================================================
 * PosVentaView
 *
 * Vista principal del POS.
 *
 * REGLAS:
 * - UI pura (sin lógica de dominio)
 * - El input de búsqueda es CONTROLADO por el POS
 * - El grid no se desmonta
 * - El scanner mantiene foco
 * =====================================================
 */
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
  onIncrease,
  onDecrease,
  total,

  bloqueado,
  cargandoCaja,
  onCobrar,

  cobro,
}: PosVentaViewProps) {
  /* =====================================================
     Handler intermedio:
     - agrega producto
     - limpia búsqueda
     - devuelve foco al scanner
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
          Contenido POS
      =============================== */}
      <div className="pt-3">
        <div
          className={
            bloqueado
              ? 'pointer-events-none opacity-40'
              : ''
          }
        >
          <div className="grid grid-cols-3 gap-4">
            {/* ===============================
                Productos
            =============================== */}
            <div className="col-span-2 space-y-4">
              {/* Búsqueda */}
              <ProductoSearchInput
                autoFocus
                placeholder="Buscar producto..."
                value={query}
                onChange={onChangeQuery}
                className="w-full px-4 py-3 text-base"
              />

              {/* Grid */}
              <ProductGrid
                productos={productos}
                stockMap={stockMap}
                loading={loadingProductos}
                onAddProduct={
                  handleAddProductFromGrid
                }
              />
            </div>

            {/* ===============================
                Carrito
            =============================== */}
            <div>
              <Cart
                items={cart}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onUserAction={onFocusScanner}
              />

              {cart.length > 0 && (
                <button
                  disabled={bloqueado}
                  onMouseDown={e => {
                    e.preventDefault()
                    if (bloqueado) return
                    onCobrar()
                  }}
                  className={`mt-4 w-full py-2 rounded text-white transition ${
                    bloqueado
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {cargandoCaja
                    ? 'Validando caja…'
                    : 'Cobrar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===============================
          Modales de Cobro
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