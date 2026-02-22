import { useParams, useNavigate } from 'react-router-dom'
import { useAdminVentaDetalleQuery } from '@/domains/venta/hooks/useAdminVentasQuery'
import VentaEstadoBadge from '../ui/VentaEstadoBadge'

export default function AdminVentaDetallePage() {
  const { ventaId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } =
    useAdminVentaDetalleQuery(ventaId)

  if (isLoading) {
    return (
      <div className="p-10 text-slate-400">
        Cargando venta...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-10 text-red-400">
        Error al cargar venta
      </div>
    )
  }

  return (
    <section className="p-6 space-y-8">

      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between">

        <div className="flex items-start gap-4">

          {/* 🔙 VOLVER */}
          <button
            onClick={() => navigate(-1)}
            className="
              mt-1
              rounded-lg
              border border-slate-800
              bg-slate-900/60
              px-3 py-2
              text-slate-300
              hover:bg-slate-800/60
              transition-colors
            "
          >
            ←
          </button>

          <div className="space-y-2">

            <h1 className="text-2xl font-semibold text-slate-100">
              Folio{' '}
              <span className="font-mono text-emerald-400">
                {data.folio}
              </span>
            </h1>

            <div className="text-sm text-slate-400 space-y-1">
              <p>Venta Nº {data.numeroVenta}</p>
              <p>
                {new Date(data.createdAt).toLocaleString()}
              </p>
            </div>

          </div>

        </div>

        <VentaEstadoBadge estado={data.estado} />

      </div>

      {/* ================= TOTALES ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <InfoCard
          label="Total productos"
          value={`$${data.total.toLocaleString()}`}
        />

        <InfoCard
          label="Ajuste redondeo"
          value={`$${data.ajusteRedondeo.toLocaleString()}`}
        />

        <InfoCard
          label="Total cobrado"
          value={`$${data.totalCobrado.toLocaleString()}`}
          highlight
        />

      </div>

      {/* ================= DOCUMENTO ================= */}

      <div
        className="
          rounded-xl
          border border-slate-800
          bg-slate-900/60
          p-5
          space-y-3
        "
      >
        <h3 className="font-medium text-slate-200">
          Documento
        </h3>

        <p className="text-sm text-slate-400 flex items-center gap-2">
          Tipo documento
          <span
            className={`
              rounded-md
              px-2 py-0.5
              text-xs font-medium
              ${
                data.documentoTributario.tipo === 'FACTURA'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }
            `}
          >
            {data.documentoTributario.tipo}
          </span>
        </p>

        {data.documentoTributario.receptor && (
          <div className="text-sm text-slate-400 space-y-1 pt-3 border-t border-slate-800">
            <p>
              <span className="text-slate-300">RUT:</span>{' '}
              {data.documentoTributario.receptor.rut}
            </p>
            <p>
              <span className="text-slate-300">
                Razón Social:
              </span>{' '}
              {data.documentoTributario.receptor.razonSocial}
            </p>
            <p>
              <span className="text-slate-300">Giro:</span>{' '}
              {data.documentoTributario.receptor.giro}
            </p>
            <p>
              <span className="text-slate-300">
                Dirección:
              </span>{' '}
              {data.documentoTributario.receptor.direccion}
            </p>
          </div>
        )}
      </div>

      {/* ================= ITEMS ================= */}

      <div
        className="
          rounded-xl
          border border-slate-800
          overflow-hidden
          bg-slate-900/60
        "
      >
        <table className="w-full text-sm">

          <thead className="bg-slate-800/60 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                Producto
              </th>
              <th className="px-4 py-3 text-right font-medium">
                Cantidad
              </th>
              <th className="px-4 py-3 text-right font-medium">
                Precio
              </th>
              <th className="px-4 py-3 text-right font-medium">
                Subtotal
              </th>
            </tr>
          </thead>

          <tbody>
            {data.items.map(i => (
              <tr
                key={i.productoId}
                className="border-t border-slate-800 hover:bg-slate-800/40"
              >
                <td className="px-4 py-3 text-slate-200">
                  {i.nombre}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">
                  {i.cantidad}
                </td>
                <td className="px-4 py-3 text-right text-slate-400">
                  ${i.precioUnitario.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-slate-200 font-medium">
                  ${i.subtotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ================= PAGOS ================= */}

      <div
        className="
          rounded-xl
          border border-slate-800
          bg-slate-900/60
          p-5
          space-y-3
        "
      >
        <h3 className="font-medium text-slate-200">
          Pagos
        </h3>

        {data.pagos.length === 0 && (
          <p className="text-sm text-slate-500">
            Sin pagos registrados
          </p>
        )}

        {data.pagos.map((p, idx) => (
          <div
            key={idx}
            className="
              flex
              items-center
              justify-between
              rounded-lg
              border border-slate-800
              bg-slate-950/40
              px-3 py-2
              text-sm
            "
          >
            <span
              className="
                rounded-md
                bg-slate-800
                px-2 py-0.5
                text-xs
                font-medium
                text-slate-300
              "
            >
              {p.tipo}
            </span>

            <span className="text-slate-200 font-semibold">
              ${p.monto.toLocaleString()}
            </span>
          </div>
        ))}

      </div>

    </section>
  )
}

/* ========================================
   Shadow InfoCard
======================================== */

function InfoCard({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className="
        rounded-xl
        border border-slate-800
        bg-slate-900/60
        p-4
      "
    >
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p
        className={`
          text-lg font-semibold
          ${highlight ? 'text-emerald-400' : 'text-slate-200'}
        `}
      >
        {value}
      </p>
    </div>
  )
}