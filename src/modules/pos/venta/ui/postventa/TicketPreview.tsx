import { memo } from 'react'
import type { PostVenta } from '../../domain/postventa.types'

/* =====================================================
   Props
===================================================== */

interface Props {
  venta: PostVenta
}

/* =====================================================
   Helpers
===================================================== */

function formatearNumeroVenta(numero?: number) {
  if (!numero && numero !== 0) return '---'
  return numero.toString().padStart(3, '0')
}

/* =====================================================
   Componente
===================================================== */

function TicketPreview({ venta }: Props) {

  const esEfectivo = venta.ajusteRedondeo !== 0

  const totalFinal = esEfectivo
    ? venta.total + venta.ajusteRedondeo
    : venta.total

  const mostrarTotalProductos =
    esEfectivo && venta.ajusteRedondeo !== 0

  return (
    <div
      className="
        bg-slate-900
        border border-slate-700
        rounded-lg
        px-5
        py-4
        font-mono
        text-xs
        text-slate-200
        shadow-inner
      "
    >

      {/* ================= Header ================= */}

      <div className="text-center space-y-1 pb-3 border-b border-slate-700">

        <div className="font-bold text-base tracking-wide">
          BERSA POS
        </div>

        <div className="text-sm">
          Venta N° {formatearNumeroVenta(venta.numeroVenta)}
        </div>

        <div className="text-slate-400">
          Folio #{venta.folio}
        </div>

        <div className="text-slate-400">
          {venta.fecha}
        </div>

      </div>

      {/* ================= Items ================= */}

      <div className="py-3 space-y-1">

        {venta.items.map(item => (
          <div
            key={item.productoId}
            className="flex justify-between gap-2"
          >

            <div className="flex-1 truncate">
              {item.nombre}
            </div>

            <div className="w-6 text-right">
              x{item.cantidad}
            </div>

            <div className="w-20 text-right">
              ${item.subtotal.toLocaleString('es-CL')}
            </div>

          </div>
        ))}

      </div>

      <Divider />

      {/* ================= Totales ================= */}

      <div className="py-3 space-y-1">

        {mostrarTotalProductos && (
          <Row
            label="Total productos"
            value={venta.total}
          />
        )}

        {esEfectivo && venta.ajusteRedondeo !== 0 && (
          <Row
            label="Ajuste redondeo"
            value={venta.ajusteRedondeo}
            sign
          />
        )}

        <Row
          label="TOTAL"
          value={totalFinal}
          bold
        />

      </div>

      <Divider />

      {/* ================= Pagos ================= */}

      <div className="py-3 space-y-1">

        {venta.pagos.map((p, i) => (
          <Row
            key={i}
            label={p.tipo.toUpperCase()}
            value={p.monto}
          />
        ))}

      </div>

      {/* ================= Footer ================= */}

      <div className="pt-3 border-t border-slate-700 text-center text-slate-400">

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
    <div className="border-t border-dashed border-slate-600" />
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
        bold ? 'font-bold text-sm' : ''
      }`}
    >
      <span className="text-slate-300">
        {label}
      </span>

      <span>
        {sign && value > 0 ? '+' : ''}
        ${value.toLocaleString('es-CL')}
      </span>
    </div>
  )
}