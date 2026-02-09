import { memo, useCallback, useState } from 'react'
import { useCaja } from '../../context/CajaProvider'
import { useCajaBarra } from '../../hooks/useCajaBarra'
import ResumenCajaModal from './ResumenCajaModal'

function BarraCajaActiva() {
  const [showCorte, setShowCorte] = useState(false)

  const barra = useCajaBarra()
  const { iniciarCierre, cargando, closingCaja } =
    useCaja()

  const disabled = cargando || closingCaja

  const handleOpenCorte = useCallback(
    () => setShowCorte(true),
    []
  )

  const handleCloseCorte = useCallback(
    () => setShowCorte(false),
    []
  )

  const handleCerrarCaja = useCallback(() => {
    iniciarCierre()
  }, [iniciarCierre])

  if (!barra.visible) return null

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="px-6 h-12 flex items-center justify-between">

          {/* Info caja */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{barra.nombreCaja}</span>
            </div>

            <span className="text-slate-600">·</span>

            <span className="text-slate-400">
              Abierta {barra.horaApertura}
            </span>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCorte}
              className="
                px-4 py-1.5 text-sm rounded-lg
                bg-slate-800 hover:bg-slate-700
                border border-slate-700
                transition
              "
            >
              Ver resumen
            </button>

            <button
              onClick={handleCerrarCaja}
              disabled={disabled}
              className="
                px-4 py-1.5 text-sm rounded-lg font-medium
                bg-red-600 hover:bg-red-500
                disabled:opacity-50
                transition
              "
            >
              {closingCaja
                ? 'Cerrando…'
                : 'Cerrar caja'}
            </button>
          </div>
        </div>
      </div>

      {showCorte && (
        <ResumenCajaModal
          cajaId={barra.cajaId}
          onClose={handleCloseCorte}
        />
      )}
    </>
  )
}

export default memo(BarraCajaActiva)