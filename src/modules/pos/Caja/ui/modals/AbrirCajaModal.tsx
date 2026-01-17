import { useState } from 'react'
import { useCaja } from '../../context/CajaProvider'
import ModalBase from './ModalBase'

/**
 * Modal para abrir una caja seleccionada
 *
 * - Usa ModalBase (portal + overlay)
 * - Visible solo si hay caja y no hay apertura
 */
export default function AbrirCajaModal() {
  const {
    cajaSeleccionada,
    aperturaActiva,
    abrirCaja,
    cargando,
  } = useCaja()

  const [montoInicial, setMontoInicial] =
    useState('')

  /* -------------------------------
     Condiciones de visibilidad
  -------------------------------- */
  if (!cajaSeleccionada) return null
  if (aperturaActiva) return null

  /* -------------------------------
     Handlers
  -------------------------------- */
  const handleConfirmar = async () => {
    const monto = Number(montoInicial)

    if (Number.isNaN(monto) || monto < 0) {
      return
    }

    await abrirCaja(monto)
  }

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <ModalBase
      title="Abrir caja"
      maxWidth="sm"
    >
      <div className="space-y-5">
        <div className="text-sm text-slate-400">
          Caja seleccionada
        </div>

        <div className="text-lg font-medium text-emerald-400">
          {cajaSeleccionada.nombre}
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-300">
            Monto inicial
          </label>

          <input
            type="number"
            inputMode="numeric"
            autoFocus
            value={montoInicial}
            onChange={(e) =>
              setMontoInicial(e.target.value)
            }
            disabled={cargando}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleConfirmar}
            disabled={cargando}
            className="px-5 py-2 rounded-lg bg-emerald-600
                       hover:bg-emerald-500 disabled:opacity-50 font-medium"
          >
            {cargando
              ? 'Abriendo...'
              : 'Abrir caja'}
          </button>
        </div>
      </div>
    </ModalBase>
  )
}