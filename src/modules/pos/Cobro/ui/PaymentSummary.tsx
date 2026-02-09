import { memo } from 'react'
import type { EstadoCobro } from '../domain/cobro.types'

interface Props {
  estado: EstadoCobro
}

function PaymentSummary({ estado }: Props) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 space-y-2 text-sm">

      {/* Subtotal */}
      <Row
        label="Subtotal"
        value={estado.totalVenta}
        muted
      />

      {/* Ajuste */}
      {estado.ajusteRedondeo !== 0 && (
        <Row
          label="Ajuste redondeo"
          value={estado.ajusteRedondeo}
          sign
          muted
        />
      )}

      {/* Total a cobrar */}
      <Row
        label="Total a cobrar"
        value={estado.totalCobrado}
        highlight
      />

      {/* Total pagado */}
      <Row
        label="Total pagado"
        value={estado.totalPagado}
      />

      <div className="border-t border-slate-700 my-1" />

      {/* Diferencias */}
      {estado.falta > 0 && (
        <Row
          label="Falta"
          value={estado.falta}
          negative
        />
      )}

      {estado.vuelto > 0 && (
        <Row
          label="Cambio"
          value={estado.vuelto}
          positive
        />
      )}

      {/* Estado */}
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

export default memo(PaymentSummary)

/* ===================================================== */

interface RowProps {
  label: string
  value: number
  muted?: boolean
  highlight?: boolean
  positive?: boolean
  negative?: boolean
  sign?: boolean
}

const Row = memo(function Row({
  label,
  value,
  muted,
  highlight,
  positive,
  negative,
  sign,
}: RowProps) {

  const color = highlight
    ? 'text-emerald-400 text-lg font-semibold'
    : positive
    ? 'text-emerald-400 font-semibold'
    : negative
    ? 'text-red-400 font-semibold'
    : muted
    ? 'text-slate-400'
    : 'text-slate-200'

  return (
    <div className="flex justify-between">
      <span className={muted ? 'text-slate-400' : ''}>
        {label}
      </span>

      <span className={color}>
        {sign && value > 0 ? '+' : ''}
        ${value.toLocaleString('es-CL')}
      </span>
    </div>
  )
})