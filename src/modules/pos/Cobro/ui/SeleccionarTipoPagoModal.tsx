import { memo, useCallback } from 'react'
import { PAYMENT_METHODS } from '../../domain/payments.logic'
import type { TipoPago } from '../../domain/pos.types'

/* =====================================================
   Props
===================================================== */

interface Props {
  onSelect: (tipo: TipoPago) => void
  onClose: () => void
}

/* =====================================================
   Componente
===================================================== */

/**
 * Modal para seleccionar el método de pago.
 *
 * - UI pura
 * - No conoce reglas de cobro
 * - No construye pagos
 */
function SeleccionarTipoPagoModal({
  onSelect,
  onClose,
}: Props) {

  const handleSelect = useCallback(
    (tipo: TipoPago) => {
      onSelect(tipo)
    },
    [onSelect]
  )

  const handleClose = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      onClose()
    },
    [onClose]
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[420px] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            ¿Cómo paga el cliente?
          </h2>
          <p className="text-sm text-slate-400">
            Selecciona el método de pago
          </p>
        </div>

        {/* Métodos */}
        <div className="space-y-3">
          {(Object.keys(
            PAYMENT_METHODS
          ) as TipoPago[]).map(tipo => {

            const metodo =
              PAYMENT_METHODS[tipo]

            return (
              <button
                key={tipo}
                onMouseDown={e => {
                  e.preventDefault()
                  handleSelect(tipo)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSelect(tipo)
                  }
                }}
                className="
                  w-full
                  text-left
                  rounded-xl
                  border border-slate-700
                  bg-slate-800
                  hover:border-emerald-500
                  hover:bg-emerald-500/10
                  p-4
                  transition
                  cursor-pointer
                  focus:outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                "
              >
                <div className="text-base font-semibold text-slate-100">
                  {metodo.label}
                </div>

                <div className="text-sm text-slate-400">
                  {metodo.description}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <button
          onMouseDown={handleClose}
          className="
            mt-6
            w-full
            rounded-xl
            bg-slate-800
            hover:bg-slate-700
            py-2
            text-sm
            text-slate-300
            transition
          "
        >
          Cancelar
        </button>

      </div>
    </div>
  )
}

export default memo(SeleccionarTipoPagoModal)