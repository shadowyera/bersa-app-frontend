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
        px-4 py-2
        text-xs font-semibold
        uppercase tracking-wide
        text-muted-foreground
        border-b border-border
        bg-background/40
      ">
        Ventas del turno
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto">

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
                transition-all
                duration-150
                ${
                  selected
                    ? 'bg-primary/10'
                    : 'hover:bg-primary/5'
                }
                ${
                  anulada
                    ? 'opacity-60'
                    : ''
                }
              `}
            >

              {/* Indicador azul lateral */}
              {selected && (
                <span
                  className="
                    absolute left-0 top-0 bottom-0
                    w-1
                    bg-primary
                    rounded-r
                    z-10
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
                      : 'font-medium'
                  }
                >
                  ${v.total.toLocaleString('es-CL')}
                </span>

              </div>

              {/* Línea inferior */}
              <div className="flex justify-between items-center text-xs mt-1">

                {/* Hora */}
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

                {/* Estado + Tipo */}
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

              {/* Línea divisoria manual */}
              <span className="absolute bottom-0 left-0 right-0 h-px bg-border" />

            </button>
          )
        })}

      </div>

    </div>
  )
}