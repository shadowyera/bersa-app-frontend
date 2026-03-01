import { Badge } from '@/shared/ui/badge/badge'

interface Props {
  estado: 'FINALIZADA' | 'ANULADA'
}

export default function VentaEstadoBadge({ estado }: Props) {

  const variant =
    estado === 'FINALIZADA'
      ? 'success'
      : 'danger'

  const label =
    estado === 'FINALIZADA'
      ? 'Finalizada'
      : 'Anulada'

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  )
}