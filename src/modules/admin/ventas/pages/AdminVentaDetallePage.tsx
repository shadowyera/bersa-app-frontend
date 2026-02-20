import { useParams } from 'react-router-dom'
import { useAdminVentaDetalleQuery } from '@/domains/venta/hooks/useAdminVentasQuery'
import VentaEstadoBadge from '../ui/VentaEstadoBadge'

export default function AdminVentaDetallePage() {
  const { ventaId } = useParams()

  const { data, isLoading, error } =
    useAdminVentaDetalleQuery(ventaId)

  if (isLoading) {
    return (
      <div className="p-6">
        Cargando venta...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-500">
        Error al cargar venta
      </div>
    )
  }

  return (
    <section className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Venta #{data.numeroVenta}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(data.createdAt)
              .toLocaleString()}
          </p>
        </div>

        <VentaEstadoBadge
          estado={data.estado}
        />
      </div>

      {/* Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <InfoCard
          label="Total"
          value={`$${data.total.toLocaleString()}`}
        />

        <InfoCard
          label="Ajuste redondeo"
          value={`$${data.ajusteRedondeo.toLocaleString()}`}
        />

        <InfoCard
          label="Total cobrado"
          value={`$${data.totalCobrado.toLocaleString()}`}
        />

      </div>

      {/* Documento */}
      <div className="rounded-xl border p-4 space-y-2">
        <h3 className="font-medium">
          Documento
        </h3>

        <p>
          Tipo:{" "}
          {data.documentoTributario.tipo}
        </p>

        {data.documentoTributario.receptor && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              RUT:{" "}
              {data.documentoTributario.receptor.rut}
            </p>
            <p>
              Razón Social:{" "}
              {data.documentoTributario.receptor.razonSocial}
            </p>
            <p>
              Giro:{" "}
              {data.documentoTributario.receptor.giro}
            </p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="rounded-xl border overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left">
                Producto
              </th>
              <th className="px-4 py-3 text-right">
                Cantidad
              </th>
              <th className="px-4 py-3 text-right">
                Precio
              </th>
              <th className="px-4 py-3 text-right">
                Subtotal
              </th>
            </tr>
          </thead>

          <tbody>
            {data.items.map(i => (
              <tr key={i.productoId} className="border-t">
                <td className="px-4 py-3">
                  {i.nombre}
                </td>
                <td className="px-4 py-3 text-right">
                  {i.cantidad}
                </td>
                <td className="px-4 py-3 text-right">
                  ${i.precioUnitario.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  ${i.subtotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Pagos */}
      <div className="rounded-xl border p-4 space-y-2">

        <h3 className="font-medium">
          Pagos
        </h3>

        {data.pagos.map((p, idx) => (
          <div
            key={idx}
            className="flex justify-between text-sm"
          >
            <span>{p.tipo}</span>
            <span>
              ${p.monto.toLocaleString()}
            </span>
          </div>
        ))}

      </div>

    </section>
  )
}

/* ========================================
   Small UI helper
======================================== */

function InfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
      <p className="text-lg font-medium">
        {value}
      </p>
    </div>
  )
}