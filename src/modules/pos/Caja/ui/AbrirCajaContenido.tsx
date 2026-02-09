import { memo, useCallback, useMemo, useState } from 'react'
import { useCaja } from '../context/CajaProvider'

/**
 * Contenido de apertura de caja.
 *
 * - UI pura
 * - Vive dentro de PosLock
 * - No maneja reglas de negocio
 */
function AbrirCajaContenido() {
  const {
    cajaSeleccionada,
    aperturaActiva,
    abrirCaja,
    deseleccionarCaja,
    cargando,
  } = useCaja()

  const [montoInicial, setMontoInicial] =
    useState('')

  // Guard: solo mostrar si corresponde
  if (!cajaSeleccionada || aperturaActiva)
    return null

  /* =====================================================
     Validaciones UI (NO dominio)
  ===================================================== */
  const montoValido = useMemo(() => {
    if (montoInicial === '') return false
    const monto = Number(montoInicial)
    return !Number.isNaN(monto) && monto >= 0
  }, [montoInicial])

  /* =====================================================
     Handlers
  ===================================================== */
  const handleConfirmar = useCallback(async () => {
    if (!montoValido) return
    await abrirCaja(Number(montoInicial))
  }, [montoInicial, montoValido, abrirCaja])

  const handleChangeMonto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMontoInicial(e.target.value)
    },
    []
  )

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        handleConfirmar()
      }}
      className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800 text-center">
        <h2 className="text-xl font-semibold text-slate-100">
          Apertura de caja
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Confirma los datos antes de comenzar el turno
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-6">
        {/* Caja seleccionada */}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 text-center">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Caja seleccionada
          </div>
          <div className="mt-1 text-lg font-semibold text-emerald-400">
            {cajaSeleccionada.nombre}
          </div>
        </div>

        {/* Monto inicial */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Monto inicial en efectivo
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              $
            </span>

            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={montoInicial}
              onChange={handleChangeMonto}
              disabled={cargando}
              className="
                w-full pl-8 pr-3 py-3 rounded-xl
                bg-slate-800 border border-slate-700
                text-lg text-slate-100
                focus:outline-none focus:ring-2 focus:ring-emerald-500
                disabled:opacity-60
              "
            />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Este monto quedará registrado como efectivo inicial de la caja
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex flex-col gap-3">
        <button
          type="submit"
          disabled={cargando || !montoValido}
          className="
            w-full py-3 rounded-xl font-semibold
            bg-emerald-600 hover:bg-emerald-500
            text-white text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
          "
        >
          {cargando
            ? 'Abriendo caja…'
            : 'Confirmar apertura'}
        </button>

        <button
          type="button"
          onClick={deseleccionarCaja}
          disabled={cargando}
          className="
            text-xs text-slate-400 hover:text-slate-200
            transition
          "
        >
          ← Cambiar caja seleccionada
        </button>
      </div>
    </form>
  )
}

export default memo(AbrirCajaContenido)