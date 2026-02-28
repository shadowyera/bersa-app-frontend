import type { AdminStockItem } from '@/domains/stock/domain/stock.types'

interface Props {
  items: AdminStockItem[]
  onAjustar: (stockId: string) => void
}

export default function AdminStockTable({
  items,
  onAjustar,
}: Props) {

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-slate-800 text-slate-400">
          <tr>
            <th className="text-left px-4 py-3">
              Producto
            </th>
            <th className="text-right px-4 py-3">
              Cantidad
            </th>
            <th className="text-right px-4 py-3">
              Acción
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map(item => (
            <tr
              key={item.stockId}
              className="border-t border-slate-800"
            >
              <td className="px-4 py-3">
                {item.nombreProducto}
              </td>

              <td className="px-4 py-3 text-right">
                {item.cantidad}
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  onClick={() =>
                    onAjustar(item.stockId)
                  }
                  className="
                    text-blue-400
                    hover:text-blue-300
                    text-xs
                    transition
                  "
                >
                  Ajustar
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}