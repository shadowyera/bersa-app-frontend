import { memo, useCallback } from 'react'
import { useCaja } from '../context/CajaProvider'
import { useCajasDisponibles } from '../hooks/useCajasDisponibles'

/**
 * Contenido de selección de caja.
 *
 * - Vive dentro del POS (bloqueado por PosLock)
 * - No es modal ni usa portal
 * - UI pura (orquesta hooks)
 */
function SeleccionarCajaContenido() {
  const {
    seleccionarCaja,
    validandoCaja,
  } = useCaja()

  const {
    cajas,
    loading,
    error,
  } = useCajasDisponibles()

  const handleSelectCaja = useCallback(
    (caja: {
      id: string
      nombre: string
    }) => {
      seleccionarCaja({
        id: caja.id,
        nombre: caja.nombre,
        sucursalId: '',
        activa: true,
      })
    },
    [seleccionarCaja]
  )

  return (
    <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100">
          Seleccionar caja
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Elige una caja para comenzar a operar
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">

        {loading && (
          <p className="text-sm text-slate-400">
            Cargando cajas…
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400">
            Error al cargar cajas
          </p>
        )}

        {!loading && !error && (
          <ul className="space-y-3">
            {cajas.map(caja => {
              const abierta = caja.abierta

              return (
                <li key={caja.id}>
                  <button
                    onClick={() =>
                      handleSelectCaja(caja)
                    }
                    disabled={validandoCaja}
                    className={`
                      w-full p-4 rounded-xl border
                      flex items-center justify-between
                      text-left transition-all duration-150
                      ${
                        abierta
                          ? 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20'
                          : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                      }
                      disabled:opacity-50
                    `}
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-slate-100">
                        {caja.nombre}
                      </div>

                      {abierta && (
                        <div className="text-xs text-slate-400">
                          Abierta por{' '}
                          {caja.usuarioAperturaNombre ??
                            '—'}
                        </div>
                      )}
                    </div>

                    <div
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          abierta
                            ? 'bg-emerald-500 text-emerald-950'
                            : 'bg-slate-600 text-slate-100'
                        }
                      `}
                    >
                      {abierta
                        ? 'ABIERTA'
                        : 'CERRADA'}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default memo(SeleccionarCajaContenido)