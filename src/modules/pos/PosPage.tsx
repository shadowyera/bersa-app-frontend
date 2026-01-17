import PosVentaView from './venta/ui/PosVentaView'
import { usePosController } from './usePosController'

export default function PosPage() {
  const pos = usePosController()

  return (
    <PosVentaView
      /* Scanner */
      scannerRef={pos.scannerRef}
      onAddProduct={pos.onAddProduct}
      onFocusScanner={pos.focusScanner}

      /* Productos */
      query={pos.query}
      onChangeQuery={pos.setQuery}
      productos={pos.productos}
      stockMap={pos.stockMap}
      loadingProductos={pos.loadingProductos}

      /* Venta */
      cart={pos.cart}
      onIncrease={pos.increase}
      onDecrease={pos.decrease}
      total={pos.total}

      /* Caja */
      bloqueado={pos.bloqueado}
      cargandoCaja={pos.cargandoCaja}
      onCobrar={pos.onCobrar}

      /* Cobro */
      cobro={pos.cobro}
    />
  )
}