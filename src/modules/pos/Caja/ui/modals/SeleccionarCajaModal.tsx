import { useCaja } from '../../context/CajaProvider'
import { useCajasDisponibles } from '../../hooks/useCajasDisponibles'
import ModalBase from './ModalBase'

/**
 * Modal de selección de caja
 *
 * 🔑 Regla:
 * - Si NO hay caja seleccionada → este modal se muestra
 * - El usuario SIEMPRE decide
 */
export default function SeleccionarCajaModal() {
  const {
    cajaSeleccionada,
    seleccionarCaja,
    validandoCaja,
  } = useCaja()

  const {
    cajas,
    loading,
    error,
  } = useCajasDisponibles()

  /* -------------------------------
     Condición de visibilidad
  -------------------------------- */
  if (cajaSeleccionada) return null

  return (
    <ModalBase
      title="Seleccionar caja"
      maxWidth="md"
    >
      {/* ===========================
          Estados
      ============================ */}
      {loading && (
        <p className="text-slate-400">
          Cargando cajas...
        </p>
      )}

      {error && (
        <p className="text-red-400">
          Error al cargar cajas
        </p>
      )}

      {/* ===========================
          Lista de cajas
      ============================ */}
      {!loading && !error && (
        <ul className="space-y-3">
          {cajas.map((caja) => {
            const abierta = caja.abierta

            return (
              <li key={caja.id}>
                <button
                  onClick={() =>
                    seleccionarCaja({
                      id: caja.id,
                      nombre: caja.nombre,
                      sucursalId: '', // backend valida
                      activa: true,
                    })
                  }
                  disabled={validandoCaja}
                  className={`
                    w-full px-4 py-3 rounded-xl border
                    flex items-center justify-between
                    transition
                    ${
                      abierta
                        ? 'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                    }
                    disabled:opacity-50
                  `}
                >
                  <div className="text-left">
                    <div className="font-medium">
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
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      abierta
                        ? 'bg-emerald-500 text-emerald-950'
                        : 'bg-slate-600 text-slate-100'
                    }`}
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
    </ModalBase>
  )
}