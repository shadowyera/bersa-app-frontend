import type {
  DespachoInterno,
} from '../../domain/despacho.types'

import {
  getGuiaDespachoPdfUrl,
} from '../../domain/despacho.api'

import { DespachoEstadoBadge } from './DespachoEstadoBadge'

interface Props {
  despacho: DespachoInterno
  onClose: () => void
}

/**
 * =====================================================
 * DespachoDetalleModal
 *
 * Modal informativo:
 * - Detalle del despacho
 * - Estado
 * - Acceso a guía PDF
 * =====================================================
 */
export function DespachoDetalleModal({
  despacho,
  onClose,
}: Props) {
  const handleVerGuia = () => {
    if (!despacho.id) return

    // Backend genera y sirve el PDF
    const url = getGuiaDespachoPdfUrl(despacho.id)
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-md w-full max-w-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Despacho #{despacho.id.slice(-6)}
          </h2>

          <DespachoEstadoBadge estado={despacho.estado} />
        </div>

        {/* ===============================
            Items
        =============================== */}
        <div className="border rounded-md divide-y">
          {despacho.items.map(item => (
            <div
              key={item.productoId}
              className="flex items-center justify-between p-3 text-sm"
            >
              <div>
                <div className="font-medium">
                  {item.productoId}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.cantidadDespachada}{' '}
                  {item.unidadPedido}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Base: {item.cantidadBaseDespachada}
              </div>
            </div>
          ))}
        </div>

        {/* ===============================
            Acciones
        =============================== */}
        <div className="flex justify-between pt-4">
          <button
            className="text-sm px-3 py-1 border rounded"
            onClick={onClose}
          >
            Cerrar
          </button>

          <button
            className="text-sm px-3 py-1 bg-primary text-white rounded"
            onClick={handleVerGuia}
          >
            Ver guía PDF
          </button>
        </div>
      </div>
    </div>
  )
}