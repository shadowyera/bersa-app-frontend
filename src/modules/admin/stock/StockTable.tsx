import type { StockProducto } from '@/shared/types/stock.types'

type Props = {
  stock: StockProducto[]
  loading?: boolean
  canEdit: boolean
  onToggle: (item: StockProducto) => void
}

/**
 * Tabla de stock
 * - 100% presentacional
 * - Sin lógica de fetch
 * - Sin React Query
 */
export default function StockTable({
  stock,
  loading = false,
  canEdit,
  onToggle,
}: Props) {
  const estado = (cantidad: number) => {
    if (cantidad < 0)
      return <span className="text-red-400">Negativo</span>
    if (cantidad === 0)
      return (
        <span className="text-orange-400">
          Sin stock
        </span>
      )
    if (cantidad <= 5)
      return <span className="text-yellow-400">Bajo</span>
    return <span className="text-green-400">OK</span>
  }

  return (
    <div className="rounded-lg border border-slate-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3 text-left">Producto</th>
            <th className="p-3 text-left">Proveedor</th>
            <th className="p-3 text-left">Código</th>
            <th className="p-3 text-right">Stock</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 w-40"></th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={6}
                className="p-4 text-center text-slate-400"
              >
                Cargando stock…
              </td>
            </tr>
          )}

          {!loading && stock.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="p-4 text-center text-slate-400"
              >
                No hay stock
              </td>
            </tr>
          )}

          {!loading &&
            stock.map(item => (
              <tr
                key={item._id}
                className={`border-t border-slate-800 ${
                  item.habilitado ? '' : 'opacity-60'
                }`}
              >
                <td className="p-3 font-medium">
                  {item.productoId.nombre}
                </td>

                <td className="p-3 text-slate-400 italic">
                  {item.productoId.proveedorId?.nombre ??
                    '—'}
                </td>

                <td className="p-3 text-slate-400">
                  {item.productoId.codigo}
                </td>

                <td className="p-3 text-right">
                  {item.cantidad}
                </td>

                <td className="p-3">
                  {estado(item.cantidad)}
                </td>

                <td className="p-3">
                  {canEdit && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => onToggle(item)}
                        className={
                          item.habilitado
                            ? 'text-red-400 hover:underline'
                            : 'text-green-400 hover:underline'
                        }
                      >
                        {item.habilitado
                          ? 'Desactivar'
                          : 'Activar'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}