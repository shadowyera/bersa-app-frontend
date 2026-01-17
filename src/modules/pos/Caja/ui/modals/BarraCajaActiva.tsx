import { useState } from 'react'
import { useCaja } from '../../context/CajaProvider'
import { useCajaBarra } from '../../hooks/useCajaBarra'
import ResumenCajaModal from './ResumenCajaModal'

export default function BarraCajaActiva() {
  const [showCorte, setShowCorte] = useState(false)

  const barra = useCajaBarra()
  const {
    iniciarCierre,
    cargando,
    closingCaja,
  } = useCaja()

  // Si no hay caja activa, no mostramos la barra
  if (!barra.visible) return null

  const disabled = cargando || closingCaja

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="px-4 h-10 flex items-center justify-between">
          {/* ===========================
              Info caja
          ============================ */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>{barra.nombreCaja}</span>
            </div>

            <span className="text-slate-500">·</span>

            <div className="text-slate-400">
              Abierta {barra.horaApertura}
            </div>
          </div>

          {/* ===========================
              Acciones
          ============================ */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setShowCorte(true)}
              className="px-3 py-1 bg-slate-700 rounded"
            >
              💵 Corte
            </button>

            <button
              onClick={iniciarCierre}
              disabled={disabled}
              className="px-3 py-1 bg-red-600 rounded disabled:opacity-50"
            >
              {closingCaja
                ? 'Cerrando...'
                : 'Cerrar Caja'}
            </button>
          </div>
        </div>
      </div>

      {/* ===========================
          Corte de caja (independiente)
      ============================ */}
      {showCorte && (
        <ResumenCajaModal
          cajaId={barra.cajaId}
          onClose={() => setShowCorte(false)}
        />
      )}
    </>
  )
}