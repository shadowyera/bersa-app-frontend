import type { EstadoDespachoInterno } from "../../domain/despacho.types";

interface Props {
  estado: EstadoDespachoInterno
}

/**
 * =====================================================
 * DespachoEstadoBadge
 *
 * Badge visual para estados de despacho interno
 * =====================================================
 */
export function DespachoEstadoBadge({ estado }: Props) {
  const config: Record<
    EstadoDespachoInterno,
    { label: string; className: string }
  > = {
    DESPACHADO: {
      label: 'Despachado',
      className:
        'bg-blue-100 text-blue-800 border-blue-200',
    },
    RECIBIDO: {
      label: 'Recibido',
      className:
        'bg-green-100 text-green-800 border-green-200',
    },
    OBSERVADO: {
      label: 'Observado',
      className:
        'bg-orange-100 text-orange-800 border-orange-200',
    },
  }

  const { label, className } = config[estado]

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${className}`}
    >
      {label}
    </span>
  )
}