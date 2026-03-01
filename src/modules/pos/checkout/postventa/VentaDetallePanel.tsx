import { useState, useMemo } from 'react'
import type { VentaApertura } from '@/domains/venta/domain/venta.types'
import type { PostVenta } from '@/domains/venta/domain/postventa.types'
import TicketPreview from './TicketPreview'
import { useVentaDetalle } from '@/modules/pos/hooks/useVentaDetalle'
import ConfirmModal from '@/shared/ui/ConfirmModal'
import { Badge } from '@/shared/ui/badge/badge'
import { Button } from '@/shared/ui/button/button'

interface Props {
  venta: VentaApertura | null
  onAnular: (venta: VentaApertura) => Promise<void>
}

export function VentaDetallePanel({
  venta,
  onAnular,
}: Props) {

  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    data: detalle,
    isLoading,
  } = useVentaDetalle(venta?.ventaId)

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

  /* ================= Estados tempranos ================= */

  if (!venta) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        Selecciona una venta para ver el detalle
      </div>
    )
  }

  if (isLoading || !postVenta) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        Cargando detalle de la venta…
      </div>
    )
  }

  /* ================= Permisos ================= */

  const puedeAnular =
    venta.estado === 'FINALIZADA'

  /* ================= Acciones ================= */

  const confirmarAnulacion = async () => {
    try {
      setLoading(true)
      await onAnular(venta)
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  const tipoDocumento =
    detalle?.documentoTributario?.tipo

  const rut =
    detalle?.documentoTributario?.receptor?.rut

  return (
    <div className="h-full flex flex-col bg-surface rounded-xl overflow-hidden">

      {/* ================= Header ================= */}

      <div className="
        px-5 py-4
        border-b border-border
        flex items-center justify-between
        bg-background/40
      ">

        <div className="flex flex-col gap-1">

          <div className="flex items-center gap-3">

            <span className="text-sm font-semibold">
              Venta #{venta.numeroVenta
                .toString()
                .padStart(3, '0')}
            </span>

            {tipoDocumento && (
              <Badge
                variant={
                  tipoDocumento === 'FACTURA'
                    ? 'info'
                    : 'outline'
                }
              >
                {tipoDocumento}
              </Badge>
            )}

          </div>

          {rut && (
            <span className="text-xs text-muted-foreground">
              RUT: {rut}
            </span>
          )}

        </div>

        <Badge
          variant={
            venta.estado === 'ANULADA'
              ? 'danger'
              : 'success'
          }
        >
          {venta.estado}
        </Badge>

      </div>

      {/* ================= Contenido ================= */}

      <div className="flex-1 overflow-y-auto p-5">

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

      <div className="
        p-5
        border-t border-border
        flex gap-3
        bg-background/30
      ">

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => window.print()}
        >
          Reimprimir
        </Button>

        <Button
          variant="danger"
          className="flex-1"
          disabled={!puedeAnular || loading}
          onClick={() => setShowConfirm(true)}
        >
          {loading ? 'Anulando…' : 'Anular'}
        </Button>

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