import { memo } from 'react'
import TicketPreview from './TicketPreview'
import { useModalShortcuts } from '@/shared/hooks/useModalShortcuts'
import ModalBase from '../../caja/ui/modals/ModalBase'
import { Button } from '@/shared/ui/button/button'
import type { PostVenta } from '@/domains/venta/domain/postventa.types'

/* =====================================================
   Props
===================================================== */

interface Props {
  open: boolean
  venta: PostVenta | null
  onClose: () => void
  onPrint: () => void
}

/* =====================================================
   Component
===================================================== */

function PostVentaModal({
  open,
  venta,
  onClose,
  onPrint,
}: Props) {

  useModalShortcuts({
    enabled: open,
    onConfirm: onPrint,
    onCancel: onClose,
  })

  if (!open || !venta) return null

  const esEfectivo = venta.ajusteRedondeo !== 0

  const totalFinal = esEfectivo
    ? venta.total + venta.ajusteRedondeo
    : venta.total

  return (
    <ModalBase
      title="Venta realizada"
      onClose={onClose}
      maxWidth="md"
      footer={
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cerrar (ESC)
          </Button>

          <Button
            variant="primary"
            className="flex-1"
            onClick={onPrint}
          >
            Imprimir (ENTER)
          </Button>
        </div>
      }
    >

      {/* Icono éxito */}
      <div className="flex flex-col items-center mb-5">

        <div
          className="
            w-12 h-12
            rounded-full
            bg-success/10
            flex items-center justify-center
            text-success
            text-xl font-bold
          "
        >
          ✓
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          Folio #{venta.folio}
        </p>

      </div>

      {/* Ticket */}
      <TicketPreview venta={venta} />

      {/* Total final */}
      <div className="mt-5 flex justify-between text-sm">

        <span className="text-muted-foreground">
          Total
        </span>

        <span className="text-lg font-semibold text-foreground">
          ${totalFinal.toLocaleString('es-CL')}
        </span>

      </div>

    </ModalBase>
  )
}

export default memo(PostVentaModal)