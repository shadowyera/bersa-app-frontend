import { memo } from 'react'
import type { PostVenta } from '../../domain/postventa.types'

/* =====================================================
   Props
===================================================== */

interface Props {
  venta: PostVenta
}

/* =====================================================
   Componente
===================================================== */

function TicketPreview({ venta }: Props) {

  // 🔥 Regla única:
  // Si existe ajuste => fue efectivo
  const esEfectivo = venta.ajusteRedondeo !== 0

  const totalFinal = esEfectivo
    ? venta.total + venta.ajusteRedondeo
    : venta.total

  return (
    <div
      className="
        mt-4
        rounded-xl
        bg-slate-800
        border border-slate-700
        p-4
        font-mono
        text-xs
        space-y-2
      "
    >
      {/* ================= Header ================= */}
      <div className="text-center space-y-1">
        <div className="font-bold text-sm">
          BERSA POS
        </div>
        <div>Folio #{venta.folio}</div>
        <div>{venta.fecha}</div>
      </div>

      <Divider />

      {/* ================= Items ================= */}
      <div className="space-y-1">
        {venta.items.map(item => (
          <div
            key={item.productoId}
            className="flex justify-between"
          >
            <div className="truncate max-w-[70%]">
              {item.nombre} x{item.cantidad}
            </div>

            <div>
              ${item.subtotal.toLocaleString('es-CL')}
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ================= Totales ================= */}

      <Row
        label="TOTAL PRODUCTOS"
        value={venta.total}
        bold
      />

      {esEfectivo && (
        <Row
          label="AJUSTE REDONDEO"
          value={venta.ajusteRedondeo}
          sign
        />
      )}

      <Row
        label="TOTAL A COBRAR"
        value={totalFinal}
        bold
      />

      <Divider />

      {/* ================= Pagos ================= */}

      {venta.pagos.length > 0 && (
        <div className="space-y-1">
          {venta.pagos.map((p, i) => (
            <Row
              key={i}
              label={p.tipo}
              value={p.monto}
            />
          ))}
          <Divider />
        </div>
      )}

      {/* ================= Footer ================= */}

      <div className="text-center text-slate-400">
        Gracias por su compra
      </div>
    </div>
  )
}

export default memo(TicketPreview)

/* =====================================================
   Subcomponentes
===================================================== */

function Divider() {
  return (
    <div className="border-t border-slate-600" />
  )
}

interface RowProps {
  label: string
  value: number
  bold?: boolean
  sign?: boolean
}

function Row({
  label,
  value,
  bold,
  sign,
}: RowProps) {
  return (
    <div
      className={`flex justify-between ${
        bold ? 'font-bold' : ''
      }`}
    >
      <span>{label}</span>

      <span>
        {sign && value > 0 ? '+' : ''}
        ${value.toLocaleString('es-CL')}
      </span>
    </div>
  )
}