import type { EstadoStock } from '@/domains/stock/domain/stock.types'

export type EstadoFiltro = 'TODOS' | EstadoStock

interface Props {
  value: EstadoFiltro
  onChange: (value: EstadoFiltro) => void
  conteo: Record<EstadoStock, number>
}

export function StockEstadoButtons({
  value,
  onChange,
  conteo,
}: Props) {

  const base =
    'px-4 py-2 rounded-lg text-sm font-medium transition'

  const active =
    'bg-blue-600 text-white'

  const inactive =
    'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'

  const estados: EstadoStock[] = [
    'NEGATIVO',
    'SIN_STOCK',
    'BAJO',
    'OK',
  ]

  return (
    <div className="flex flex-wrap gap-2">

      <button
        className={`${base} ${
          value === 'TODOS' ? active : inactive
        }`}
        onClick={() => onChange('TODOS')}
      >
        Todos
      </button>

      {estados.map((estado) => (
        <button
          key={estado}
          className={`${base} ${
            value === estado ? active : inactive
          }`}
          onClick={() => onChange(estado)}
        >
          {estado} ({conteo[estado]})
        </button>
      ))}

    </div>
  )
}