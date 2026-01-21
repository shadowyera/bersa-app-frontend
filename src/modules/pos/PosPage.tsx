import PosVentaView from './venta/ui/PosVentaView'
import { usePosController } from './hooks/usePosController'
import { useCaja } from './Caja/context/CajaProvider'

import PosLock from './Caja/ui/PosLock'
import SeleccionarCajaContenido from './Caja/ui/SeleccionarCajaContenido'
import AbrirCajaContenido from './Caja/ui/AbrirCajaContenido'

import { useCatalogoRealtime } from './realtime/catalogo.realtime'

/**
 * =====================================================
 * PosPage
 *
 * Página principal del POS.
 *
 * Responsabilidades:
 * - Inicializar realtime del catálogo
 * - Orquestar estados globales (Caja + POS)
 * - Renderizar la vista de venta
 *
 * ❌ No maneja lógica de negocio
 * =====================================================
 */
export default function PosPage() {
  // Infra: invalida catálogo vía SSE
  useCatalogoRealtime()

  // Controller principal del POS
  const pos = usePosController()

  // Estado de caja (para lock UX)
  const { cajaSeleccionada, aperturaActiva } = useCaja()

  const showLock = !cajaSeleccionada || !aperturaActiva

  return (
    <div className="relative h-full">
      {/* ===============================
          Lock de Caja
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
          Vista principal POS
      =============================== */}
      <PosVentaView
        /* Scanner */
        scannerRef={pos.scannerRef}
        onAddProduct={pos.onAddProduct}
        onFocusScanner={pos.focusScanner}

        /* Búsqueda / Productos */
        query={pos.query}
        onChangeQuery={pos.setQuery}
        productos={pos.productos}
        stockMap={pos.stockMap}
        loadingProductos={pos.loadingProductos}

        /* Carrito */
        cart={pos.cart}
        onIncrease={pos.increase}
        onDecrease={pos.decrease}
        total={pos.total}

        /* Caja / UX */
        bloqueado={pos.bloqueado}
        cargandoCaja={pos.cargandoCaja}
        onCobrar={pos.onCobrar}

        /* Cobro */
        cobro={pos.cobro}
      />
    </div>
  )
}