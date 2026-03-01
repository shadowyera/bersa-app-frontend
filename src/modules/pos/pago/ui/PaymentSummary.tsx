import { memo } from 'react'
import type { EstadoCobro } from '@/domains/venta/domain/cobro/cobro.types'

interface Props {
  estado: EstadoCobro
}

function formatCLP(value: number) {
  return `$${value.toLocaleString('es-CL')}`
}

function PaymentSummary({ estado }: Props) {
  return (
    <div
      className="
        rounded-xl
        bg-surface
        border border-border
        p-5
        space-y-3
        text-sm
        shadow-sm
      "
    >

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

      {/* Total a pagar (destacado pero no gigante) */}
      <Row
        label="Total a pagar"
        value={estado.totalCobrado}
        highlight
      />

      {/* Total pagado */}
      <Row
        label="Total pagado"
        value={estado.totalPagado}
      />

      <div className="border-t border-border my-2" />

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

      {/* Estado general */}
      <div className="pt-4 text-center text-xs uppercase tracking-wider">
        {estado.puedeConfirmar ? (
          <span className="text-success font-semibold">
            Listo para pagar
          </span>
        ) : (
          <span className="text-danger font-semibold">
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

  const valueColor = highlight
    ? 'text-primary text-xl font-semibold'
    : positive
    ? 'text-success text-lg font-semibold'
    : negative
    ? 'text-danger text-lg font-semibold'
    : muted
    ? 'text-muted-foreground'
    : 'text-foreground'

  return (
    <div className="flex justify-between items-center">
      <span
        className={
          muted
            ? 'text-muted-foreground'
            : 'text-foreground'
        }
      >
        {label}
      </span>

      <span className={valueColor}>
        {sign && value > 0 ? '+' : ''}
        {formatCLP(value)}
      </span>
    </div>
  )
})