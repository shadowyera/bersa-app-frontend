import { memo } from 'react'
import { useSeleccionarCaja } from '../hooks/useSeleccionarCaja'

function SeleccionarCajaContenido() {
  const {
    cajas,
    loading,
    error,
    validandoCaja,
    onSelectCaja,
  } = useSeleccionarCaja()

  return (
    <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100">
          Seleccionar caja
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Elige una caja para comenzar a operar
        </p>
      </div>

      <div className="px-6 py-5 space-y-4">
        {loading && (
          <p className="text-sm text-slate-400">
            Cargando cajas…
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && cajas.length === 0 && (
          <p className="text-sm text-slate-400">
            No hay cajas disponibles
          </p>
        )}

        <ul className="space-y-3">
          {cajas.map(caja => (
            <li key={caja.id}>
              <button
                onClick={() => onSelectCaja(caja)}
                disabled={validandoCaja}
                className={`
                  w-full p-4 rounded-xl border flex items-center justify-between
                  ${caja.abierta
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800'}
                `}
              >
                <div className="space-y-1">
                  <div className="font-medium text-slate-100">
                    {caja.nombre}
                  </div>

                  {caja.abierta && caja.abiertaPor && (
                    <div className="text-xs text-slate-400">
                      Abierta por{' '}
                      <span className="text-slate-200 font-medium">
                        {caja.abiertaPor}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${caja.abierta
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-slate-600 text-slate-100'}
                  `}
                >
                  {caja.abierta ? 'ABIERTA' : 'CERRADA'}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default memo(SeleccionarCajaContenido)