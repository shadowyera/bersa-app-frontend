import type { VentaAdmin } from '@/domains/venta/domain/venta-admin.types'
import VentaEstadoBadge from './VentaEstadoBadge'
import { useNavigate } from 'react-router-dom'

interface Props {
  ventas: VentaAdmin[]
}

export default function VentasTable({ ventas }: Props) {
  const navigate = useNavigate()

  // ============================
  // Helpers
  // ============================

  function formatAperturaLabel(dateString: string) {
    const date = new Date(dateString)

    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  // ============================
  // Agrupar por apertura
  // ============================

  const grupos = ventas.reduce((acc, v) => {
    const key = v.aperturaCajaId || 'SIN_APERTURA'

    if (!acc[key]) {
      acc[key] = {
        ventas: [],
        total: 0,
      }
    }

    acc[key].ventas.push(v)
    acc[key].total += v.totalCobrado

    return acc
  }, {} as Record<string, { ventas: VentaAdmin[]; total: number }>)

  const entries = Object.entries(grupos)

  return (
    <div className="space-y-6">

      {entries.map(([aperturaId, grupo]) => (

        <div
          key={aperturaId}
          className="
            rounded-xl
            border border-slate-800
            overflow-hidden
            bg-slate-900/40
            backdrop-blur
          "
        >

          {/* ================= HEADER APERTURA ================= */}
          <div
            className="
              flex items-center justify-between
              px-4 py-3
              bg-slate-800/60
              border-b border-slate-800
            "
          >
            <span className="text-sm font-medium text-slate-200 capitalize">
              Apertura {formatAperturaLabel(grupo.ventas[0].createdAt)}
            </span>

            <span className="text-sm font-medium text-slate-200">
              Total apertura: ${grupo.total.toLocaleString()}
            </span>
          </div>

          {/* ================= TABLA ================= */}
          <table className="w-full text-sm">

            <thead className="bg-slate-800/40 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  Nº
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Documento
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  Total
                </th>
                <th className="px-4 py-3 text-center font-medium">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody>

              {grupo.ventas.map(v => (
                <tr
                  key={v.id}
                  onClick={() =>
                    navigate(`/admin/ventas/${v.id}`)
                  }
                  className="
                    border-t border-slate-800
                    hover:bg-slate-800/40
                    cursor-pointer
                    transition-colors
                  "
                >

                  <td className="px-4 py-3 text-slate-200">
                    {v.numeroVenta}
                  </td>

                  <td className="px-4 py-3 text-slate-400">
                    {new Date(v.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className="
                        px-2 py-0.5
                        rounded
                        bg-slate-800
                        text-xs
                        text-slate-300
                      "
                    >
                      {v.documentoTributario.tipo}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-slate-200">
                    ${v.totalCobrado.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <VentaEstadoBadge estado={v.estado} />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      ))}

      {/* ================= EMPTY ================= */}
      {ventas.length === 0 && (
        <div className="p-10 text-center text-slate-400">
          No hay ventas para mostrar
        </div>
      )}

    </div>
  )
}
