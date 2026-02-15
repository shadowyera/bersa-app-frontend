import type { VentaApertura } from "@/domains/venta/domain/venta.types"

/* =====================================================
   Props
===================================================== */

interface Props {
  ventas: VentaApertura[]
  ventaSeleccionadaId?: string
  onSelect: (venta: VentaApertura) => void
  loading?: boolean
}

/* =====================================================
   Componente
===================================================== */

export function VentasAperturaList({
  ventas,
  ventaSeleccionadaId,
  onSelect,
  loading,
}: Props) {

  if (loading) {
    return (
      <div className="p-4 text-sm text-slate-400">
        Cargando ventas…
      </div>
    )
  }

  if (!ventas.length) {
    return (
      <div className="p-4 text-sm text-slate-400">
        No hay ventas en este turno
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col border-r border-slate-700">

      {/* Header */}
      <div className="px-4 py-2 text-xs uppercase tracking-wide text-slate-400 border-b border-slate-700">
        Ventas del turno
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800">

        {ventas.map(v => {

          const selected =
            v.ventaId === ventaSeleccionadaId

          const anulada =
            v.estado === 'ANULADA'

          const tipoDocumento =
            v.documentoTributario?.tipo

          return (
            <button
              key={v.ventaId}
              onClick={() => onSelect(v)}
              className={`
                w-full
                text-left
                px-4 py-3
                text-sm
                transition
                hover:bg-slate-700
                ${
                  selected
                    ? 'bg-slate-700'
                    : 'bg-transparent'
                }
                ${
                  anulada
                    ? 'opacity-50'
                    : ''
                }
              `}
            >

              {/* Línea superior */}
              <div className="flex justify-between items-center">

                <span className="font-mono">
                  #{v.numeroVenta
                    .toString()
                    .padStart(3, '0')}
                </span>

                <span className="font-medium">
                  ${v.total.toLocaleString('es-CL')}
                </span>

              </div>

              {/* Línea inferior */}
              <div className="flex justify-between items-center text-xs mt-1">

                {/* Hora */}
                <span className="text-slate-400">
                  {new Date(v.fecha)
                    .toLocaleTimeString(
                      'es-CL',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                </span>

                {/* Estado + Tipo */}
                <div className="flex items-center gap-2">

                  <span
                    className={
                      v.estado === 'ANULADA'
                        ? 'text-red-400'
                        : 'text-emerald-400'
                    }
                  >
                    {v.estado}
                  </span>

                  {tipoDocumento && (
                    <span
                      className={`
                        px-2 py-0.5 rounded text-[10px] font-medium
                        ${
                          tipoDocumento === 'FACTURA'
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }
                      `}
                    >
                      {tipoDocumento}
                    </span>
                  )}

                </div>

              </div>

            </button>
          )
        })}

      </div>

    </div>
  )
}