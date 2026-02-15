import { useState, useMemo } from 'react'
import type { VentaApertura } from '../../domain/venta.types'
import type { PostVenta } from '@/domains/venta/domain/postventa.types'
import TicketPreview from './TicketPreview'
import { useVentaDetalle } from '@/modules/pos/hooks/useVentaDetalle'
import ConfirmModal from '@/shared/ui/ConfirmModal'

/* =====================================================
   Props
===================================================== */

interface Props {
  venta: VentaApertura | null
  onAnular: (ventaId: string) => Promise<void>
}

/* =====================================================
   Componente
===================================================== */

export function VentaDetallePanel({
  venta,
  onAnular,
}: Props) {

  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  /* ================================
     Obtener detalle real
  ================================ */

  const {
    data: detalle,
    isLoading,
  } = useVentaDetalle(venta?.ventaId)

  /* ================================
     Adaptar VentaDetalle → PostVenta
  ================================ */

  const postVenta: PostVenta | null = useMemo(() => {

    if (!venta || !detalle) return null

    return {
      ventaId: venta.ventaId,
      numeroVenta: venta.numeroVenta,

      folio: venta.ventaId.slice(-6),

      fecha: new Date(detalle.createdAt)
        .toLocaleString('es-CL'),

      total: detalle.total,
      ajusteRedondeo: detalle.ajusteRedondeo,
      totalCobrado: detalle.totalCobrado,

      items: detalle.items,

      pagos: detalle.pagos.map(p => ({
        tipo: p.tipo as any,
        monto: p.monto,
      })),
    }

  }, [venta, detalle])

  /* ================================
     Estados tempranos
  ================================ */

  if (!venta) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-400">
        Selecciona una venta para ver el detalle
      </div>
    )
  }

  if (isLoading || !postVenta) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-400">
        Cargando detalle de la venta…
      </div>
    )
  }

  /* ================================
     Permisos
  ================================ */

  const puedeAnular =
    venta.estado === 'FINALIZADA'

  /* ================================
     Acciones
  ================================ */

  const confirmarAnulacion = async () => {
    try {
      setLoading(true)
      await onAnular(venta.ventaId)
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  const tipoDocumento =
    postVenta
      ? detalle?.documentoTributario?.tipo
      : undefined

  const rut =
    postVenta
      ? detalle?.documentoTributario?.receptor?.rut
      : undefined

  /* ================================
     Render
  ================================ */

  return (
    <div className="h-full flex flex-col">

      {/* ================= Header ================= */}

      <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <div className="text-sm font-medium">
            Venta #{venta.numeroVenta
              .toString()
              .padStart(3, '0')}
          </div>

          {tipoDocumento && (
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${tipoDocumento === 'FACTURA'
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'bg-emerald-500/10 text-emerald-400'
                }`}
            >
              {tipoDocumento}
            </span>
          )}

          {rut && (
            <span className="text-xs text-slate-400">
              RUT: {rut}
            </span>
          )}

        </div>

        <div
          className={`text-xs font-medium ${venta.estado === 'ANULADA'
              ? 'text-red-400'
              : 'text-emerald-400'
            }`}
        >
          {venta.estado}
        </div>

      </div>

      {/* ================= Contenido ================= */}

      <div className="flex-1 overflow-y-auto p-4">

        <div
          className={
            venta.estado === 'ANULADA'
              ? 'opacity-60'
              : ''
          }
        >
          <TicketPreview venta={postVenta} />
        </div>

      </div>

      {/* ================= Acciones ================= */}

      <div className="p-4 border-t border-slate-700 flex gap-2">

        <button
          onClick={() => window.print()}
          className="
            flex-1
            py-2
            text-sm
            rounded
            bg-slate-700
            hover:bg-slate-600
            text-white
          "
        >
          Reimprimir
        </button>

        <button
          disabled={!puedeAnular || loading}
          onClick={() => setShowConfirm(true)}
          className={`flex-1 py-2 text-sm rounded text-white ${puedeAnular
              ? 'bg-red-600 hover:bg-red-500'
              : 'bg-slate-600 cursor-not-allowed'
            }`}
        >
          {loading ? 'Anulando…' : 'Anular'}
        </button>

      </div>

      {/* ================= Confirm Modal ================= */}

      <ConfirmModal
        open={showConfirm}
        title="Anular venta"
        description={`¿Estás seguro de anular la venta N° ${venta.numeroVenta}? Esta acción no se puede deshacer.`}
        confirmText="Sí, anular venta"
        cancelText="Cancelar"
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmarAnulacion}
      />

    </div>
  )
}