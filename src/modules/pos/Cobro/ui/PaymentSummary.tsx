import type { EstadoCobro } from '../domain/cobro.types'

interface Props {
  estado: EstadoCobro
}

/**
 * PaymentSummary
 *
 * - UI PURA
 * - Solo lectura del EstadoCobro
 * - No calcula ni valida nada
 */
export default function PaymentSummary({ estado }: Props) {
  return (
    <div className="bg-slate-900 rounded-xl p-4 space-y-2 text-sm">

      {/* ===============================
          Total original
         =============================== */}
      <div className="flex justify-between text-slate-400">
        <span>Total productos</span>
        <span>
          ${estado.totalVenta.toLocaleString('es-CL')}
        </span>
      </div>

      {/* ===============================
          Ajuste de redondeo (si aplica)
         =============================== */}
      {estado.ajusteRedondeo !== 0 && (
        <div className="flex justify-between text-slate-400">
          <span>Ajuste redondeo</span>
          <span>
            {estado.ajusteRedondeo > 0 ? '+' : ''}
            {estado.ajusteRedondeo.toLocaleString('es-CL')}
          </span>
        </div>
      )}

      {/* ===============================
          Total a cobrar
         =============================== */}
      <div className="flex justify-between text-lg font-bold">
        <span>Total a cobrar</span>
        <span className="text-emerald-400">
          ${estado.totalCobrado.toLocaleString('es-CL')}
        </span>
      </div>

      {/* ===============================
          Total pagado
         =============================== */}
      <div className="flex justify-between text-slate-300">
        <span>Total pagado</span>
        <span>
          ${estado.totalPagado.toLocaleString('es-CL')}
        </span>
      </div>

      {/* ===============================
          Falta
         =============================== */}
      {estado.falta > 0 && (
        <div className="flex justify-between text-red-400 font-semibold">
          <span>Falta</span>
          <span>
            ${estado.falta.toLocaleString('es-CL')}
          </span>
        </div>
      )}

      {/* ===============================
          Vuelto
         =============================== */}
      {estado.vuelto > 0 && (
        <div className="flex justify-between text-emerald-400 font-semibold">
          <span>Vuelto</span>
          <span>
            ${estado.vuelto.toLocaleString('es-CL')}
          </span>
        </div>
      )}

      {/* ===============================
          Estado final
         =============================== */}
      <div className="pt-2 text-center text-xs uppercase tracking-wide">
        {estado.puedeConfirmar ? (
          <span className="text-emerald-400">
            Listo para cobrar
          </span>
        ) : (
          <span className="text-red-400">
            Monto insuficiente
          </span>
        )}
      </div>

    </div>
  )
}