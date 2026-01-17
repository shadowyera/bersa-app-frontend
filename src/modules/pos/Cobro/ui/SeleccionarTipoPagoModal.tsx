import { PAYMENT_METHODS } from '../../pos.payments'
import type { TipoPago } from '../../pos.types'

interface Props {
  /**
   * Se dispara cuando el usuario elige
   * un método de pago
   */
  onSelect: (tipo: TipoPago) => void

  /**
   * Cierra el modal sin seleccionar
   */
  onClose: () => void
}

/**
 * SeleccionarTipoPagoModal
 *
 * - UI PURA
 * - No contiene lógica de negocio
 * - No conoce cobro ni pagos
 */
export default function SeleccionarTipoPagoModal({
  onSelect,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-800 p-6 rounded-xl w-[420px]">

        {/* ===============================
            Título
           =============================== */}
        <h2 className="text-lg font-bold mb-4 text-white">
          ¿Cómo paga el cliente?
        </h2>

        {/* ===============================
            Métodos de pago
           =============================== */}
        <div className="space-y-3">
          {(Object.keys(PAYMENT_METHODS) as TipoPago[]).map(
            tipo => {
              const metodo = PAYMENT_METHODS[tipo]

              return (
                <button
                  key={tipo}
                  onMouseDown={e => {
                    e.preventDefault()
                    onSelect(tipo)
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

        {/* ===============================
            Cancelar
           =============================== */}
        <button
          onMouseDown={e => {
            e.preventDefault()
            onClose()
          }}
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