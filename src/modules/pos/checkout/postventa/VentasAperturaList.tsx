import type { VentaApertura } from "@/domains/venta/domain/venta.types"
import { Badge } from "@/shared/ui/badge/badge"

interface Props {
  ventas: VentaApertura[]
  ventaSeleccionadaId?: string
  onSelect: (venta: VentaApertura) => void
  loading?: boolean
}

export function VentasAperturaList({
  ventas,
  ventaSeleccionadaId,
  onSelect,
  loading,
}: Props) {

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Cargando ventas…
      </div>
    )
  }

  if (!ventas.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No hay ventas en este turno
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col border-r border-border bg-surface rounded-xl overflow-hidden">

      {/* Header */}
      <div className="
        px-4 py-3
        text-xs font-semibold
        uppercase tracking-wide
        text-muted-foreground
        border-b border-border
        bg-background/40
      ">
        Ventas del turno
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">

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
                relative
                w-full
                text-left
                px-4 py-3
                text-sm
                transition-colors
                duration-150
                ${
                  selected
                    ? 'bg-background'
                    : 'hover:bg-background/60'
                }
                ${
                  anulada
                    ? 'opacity-60'
                    : ''
                }
              `}
            >

              {/* Indicador lateral */}
              {selected && (
                <span
                  className="
                    absolute left-0 top-0 bottom-0
                    w-[3px]
                    bg-primary
                  "
                />
              )}

              {/* Línea superior */}
              <div className="flex justify-between items-center">

                <span className="font-mono text-foreground">
                  #{v.numeroVenta
                    .toString()
                    .padStart(3, '0')}
                </span>

                <span
                  className={
                    anulada
                      ? 'line-through text-muted-foreground'
                      : 'font-medium text-foreground'
                  }
                >
                  ${v.total.toLocaleString('es-CL')}
                </span>

              </div>

              {/* Línea inferior */}
              <div className="flex justify-between items-center text-xs mt-1">

                <span className="text-muted-foreground">
                  {new Date(v.fecha)
                    .toLocaleTimeString(
                      'es-CL',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                </span>

                <div className="flex items-center gap-2">

                  <Badge
                    variant={
                      anulada
                        ? "danger"
                        : "success"
                    }
                  >
                    {v.estado}
                  </Badge>

                  {tipoDocumento && (
                    <Badge
                      variant={
                        tipoDocumento === "FACTURA"
                          ? "info"
                          : "outline"
                      }
                    >
                      {tipoDocumento}
                    </Badge>
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