import { memo } from 'react'
import type { PostVenta } from '../../hooks/postventa.types'
import TicketPreview from './TicketPreview'
import { useModalShortcuts } from '@/shared/hooks/useModalShortcuts'

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
   Componente
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

  /* ===============================
     Regla única efectivo
  =============================== */

  const esEfectivo = venta.ajusteRedondeo !== 0

  const totalFinal = esEfectivo
    ? venta.total + venta.ajusteRedondeo
    : venta.total

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div
        className="
          w-[420px]
          rounded-2xl
          bg-slate-900
          border border-slate-700
          shadow-2xl
          p-6
        "
      >

        {/* =====================
            Header
        ===================== */}

        <div className="text-center mb-4">
          <div className="text-emerald-400 text-3xl mb-1">
            ✔
          </div>

          <h2 className="text-xl font-semibold text-slate-100">
            Venta realizada
          </h2>

          <p className="text-sm text-slate-400">
            Folio #{venta.folio}
          </p>
        </div>

        {/* =====================
            Ticket Preview
        ===================== */}

        <TicketPreview venta={venta} />

        {/* =====================
            Total Final
        ===================== */}

        <div className="mt-4 flex justify-between text-sm">
          <span>Total</span>

          <span className="text-emerald-400 font-semibold">
            ${totalFinal.toLocaleString('es-CL')}
          </span>
        </div>

        {/* =====================
            Acciones
        ===================== */}

        <div className="mt-6 flex gap-3">

          <button
            onMouseDown={onClose}
            className="
              flex-1
              rounded-xl
              bg-slate-700
              hover:bg-slate-600
              py-3
              text-sm
              transition
            "
          >
            Cerrar (ESC)
          </button>

          <button
            onMouseDown={onPrint}
            className="
              flex-1
              rounded-xl
              bg-emerald-600
              hover:bg-emerald-500
              py-3
              text-sm font-semibold
              transition
            "
          >
            Imprimir (ENTER)
          </button>

        </div>

      </div>
    </div>
  )
}

export default memo(PostVentaModal)