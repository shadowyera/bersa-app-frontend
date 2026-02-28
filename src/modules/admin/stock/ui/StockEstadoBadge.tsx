interface Props {
  estado: 'NEGATIVO' | 'SIN_STOCK' | 'BAJO' | 'OK'
}

export default function StockEstadoBadge({
  estado,
}: Props) {

  const styles = {
    NEGATIVO: 'bg-red-900 text-red-400',
    SIN_STOCK: 'bg-orange-900 text-orange-400',
    BAJO: 'bg-yellow-900 text-yellow-400',
    OK: 'bg-emerald-900 text-emerald-400',
  }

  return (
    <span
      className={`
        px-2 py-1
        rounded
        text-xs
        font-medium
        ${styles[estado]}
      `}
    >
      {estado}
    </span>
  )
}