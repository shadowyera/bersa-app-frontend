import { memo, useCallback } from 'react'
import { PAYMENT_METHODS } from '../../pos.payments'
import type { TipoPago } from '../../pos.types'

interface Props {
  onSelect: (tipo: TipoPago) => void
  onClose: () => void
}

/**
 * Modal para seleccionar el método de pago.
 *
 * - UI pura
 * - No conoce reglas de cobro ni dominio
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-800 p-6 rounded-xl w-[420px]">

        <h2 className="text-lg font-bold mb-4 text-white">
          ¿Cómo paga el cliente?
        </h2>

        <div className="space-y-3">
          {(Object.keys(PAYMENT_METHODS) as TipoPago[]).map(
            tipo => {
              const metodo = PAYMENT_METHODS[tipo]

              return (
                <button
                  key={tipo}
                  onMouseDown={e => {
                    e.preventDefault()
                    handleSelect(tipo)
                  }}
                  className="
                    w-full text-left p-4 rounded-lg
                    bg-slate-700 hover:bg-emerald-600
                    transition
                  "
                >
                  <div className="font-semibold text-lg">
                    {tipo.charAt(0) +
                      tipo.slice(1).toLowerCase()}
                  </div>

                  <div className="text-sm text-slate-300">
                    {metodo.description}
                  </div>
                </button>
              )
            }
          )}
        </div>

        <button
          onMouseDown={handleClose}
          className="
            mt-4 w-full text-sm
            text-slate-400 hover:text-white
          "
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default memo(SeleccionarTipoPagoModal)