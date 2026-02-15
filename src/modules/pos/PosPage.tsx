/* ===============================
   Infra
=============================== */
import { useCatalogoRealtime } from './realtime/catalogo.realtime'

/* ===============================
   Controllers
=============================== */
import { usePosController } from './hooks/usePosController'
import { useCaja } from './caja/context/CajaProvider'
import { usePosShortcuts } from './hooks/usePosShortcuts'

/* ===============================
   UI Venta
=============================== */
import PosVentaView from './checkout/PosVentaView'
import PostVentaModal from './checkout/postventa/PostVentaModal'

/* ===============================
   UI Caja
=============================== */
import PosLock from './caja/ui/PosLock'
import SeleccionarCajaContenido from './caja/ui/SeleccionarCajaContenido'
import AbrirCajaContenido from './caja/ui/AbrirCajaContenido'

/* =======================================================
   POS PAGE
======================================================= */

export default function PosPage() {

  /* ===============================
     Realtime catálogo
  =============================== */
  useCatalogoRealtime()

  /* ===============================
     Controller principal POS
  =============================== */
  const pos = usePosController()

  /* ===============================
     Estado de Caja
  =============================== */
  const { cajaSeleccionada, aperturaActiva } = useCaja()

  const showLock =
    !cajaSeleccionada || !aperturaActiva

  /* =======================================================
     SHORTCUTS TECLADO
  ======================================================= */

usePosShortcuts({
  mode: pos.showReceptor
    ? null
    : pos.cobro.showPayment
    ? 'PAGO'
    : pos.cobro.showTipoPago
    ? 'TIPO_PAGO'
    : 'VENTA',

  onCobrar: pos.onCobrar,
  onIncreaseLast: pos.increaseLast,
  onDecreaseLast: pos.decreaseLast,

  onSelectTipoPago: pos.cobro.selectTipoPago,
  onConfirmPago: pos.cobro.confirm,
  onBack: pos.cobro.closeAll,
})

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="relative h-full">

      {/* ===============================
          LOCK CAJA
      =============================== */}

      <PosLock open={showLock}>

        {!cajaSeleccionada && (
          <SeleccionarCajaContenido />
        )}

        {cajaSeleccionada && !aperturaActiva && (
          <AbrirCajaContenido />
        )}

      </PosLock>

      {/* ===============================
          POS
      =============================== */}

      <PosVentaView
        scannerRef={pos.scannerRef}
        onAddProduct={pos.onAddProduct}
        onFocusScanner={pos.focusScanner}

        query={pos.query}
        onChangeQuery={pos.setQuery}
        productos={pos.productos}
        stockMap={pos.stockMap}
        loadingProductos={pos.loadingProductos}
        showReceptor={pos.showReceptor}
        onCloseReceptor={pos.closeReceptor}
        cart={pos.cart}
        highlightedId={pos.highlightedId}

        onIncrease={pos.increase}
        onDecrease={pos.decrease}
        total={pos.total}
        onClearCart={pos.clearCart}

        /* ===== DOCUMENTO ===== */
        documentoTributario={
          pos.documentoTributario
        }
        onSetTipoDocumento={
          pos.setTipoDocumento
        }
        onSetReceptor={
          pos.setReceptor
        }

        bloqueado={pos.bloqueado}
        cargandoCaja={pos.cargandoCaja}
        onCobrar={pos.onCobrar}

        cobro={pos.cobro}
      />

      {/* ===============================
          POST VENTA
      =============================== */}

      <PostVentaModal
        open={pos.postVenta.open}
        venta={pos.postVenta.venta}
        onClose={pos.postVenta.closePostVenta}
        onPrint={() => window.print()}
      />

    </div>
  )
}