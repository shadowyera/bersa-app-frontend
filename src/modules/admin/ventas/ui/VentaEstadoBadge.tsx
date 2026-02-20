interface Props {
  estado: 'FINALIZADA' | 'ANULADA'
}

export default function VentaEstadoBadge({ estado }: Props) {
  const styles =
    estado === 'FINALIZADA'
      ? 'bg-emerald-500/15 text-emerald-400'
      : 'bg-red-500/15 text-red-400'

  const label =
    estado === 'FINALIZADA'
      ? 'Finalizada'
      : 'Anulada'

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${styles}
      `}
    >
      {label}
    </span>
  )
}