import React from 'react'

/* ===============================
   UI POS – Vista de Venta
=============================== */
import ProductGrid from './product/ProductGrid'
import Cart from './cart/Cart'
import ProductScanner from './scanner/ProductScanner'
import PaymentModal from '../../Cobro/ui/PaymentModal'
import SeleccionarTipoPagoModal from '../../Cobro/ui/SeleccionarTipoPagoModal'

/* ===============================
   Types
=============================== */

/**
 * Props de PosVentaView
 *
 * IMPORTANTE:
 * - Este componente es 100% PRESENTACIONAL
 * - No usa hooks de dominio
 * - No conoce reglas de negocio
 * - Todo llega resuelto desde el controller
 */
export interface PosVentaViewProps {
  /* ===============================
     Scanner
  =============================== */
  scannerRef: React.RefObject<HTMLInputElement | null>
  onAddProduct: (producto: any) => void
  onFocusScanner: () => void

  /* ===============================
     Productos
  =============================== */
  query: string
  onChangeQuery: (value: string) => void
  productos: any[]
  stockMap: Record<string, number>
  loadingProductos: boolean

  /* ===============================
     Venta / Carrito
  =============================== */
  cart: any[]
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
  cobro: {
    showTipoPago: boolean
    showPayment: boolean
    modoPago: any
    estado: any
    loading: boolean
    setEfectivo: (value: string) => void
    setDebito: (value: string) => void
    confirm: () => void
    closeAll: () => void
    selectTipoPago: (tipo: any) => void
  }
}

/**
 * PosVentaView
 *
 * Vista principal del POS (venta).
 *
 * Responsabilidades:
 * - Renderizar scanner, productos, carrito y cobro
 * - Aplicar bloqueos visuales
 *
 * NO:
 * - Maneja estado
 * - Usa hooks de dominio
 * - Conoce reglas de negocio
 */
export default function PosVentaView({
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
  return (
    <>
      {/* ===============================
          Scanner
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
              <input
                placeholder="Buscar producto..."
                value={query}
                onChange={e =>
                  onChangeQuery(e.target.value)
                }
                className="w-full bg-slate-800 p-2 rounded text-slate-100"
              />

              <ProductGrid
                productos={productos}
                stockMap={stockMap}
                loading={loadingProductos}
                onAddProduct={onAddProduct}
                onAnyClick={onFocusScanner}
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