import type { Categoria } from '@/shared/types/categoria.types'

type Props = {
  categorias: Categoria[]
  loading?: boolean
  canEdit: boolean
  onEdit: (categoria: Categoria) => void
  onToggle: (categoria: Categoria) => void
}

export default function CategoriasTable({
  categorias,
  loading = false,
  canEdit,
  onEdit,
  onToggle,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Tipo</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 w-40"></th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-slate-400">
                Cargando categorías...
              </td>
            </tr>
          )}

          {!loading && categorias.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-slate-400">
                No hay categorías
              </td>
            </tr>
          )}

          {categorias.map(cat => (
            <tr
              key={cat._id}
              className={`border-t border-slate-800 ${
                !cat.activo ? 'opacity-60' : ''
              }`}
            >
              <td className="p-3 font-medium">{cat.nombre}</td>

              <td className="p-3 text-slate-400">{cat.tipo}</td>

              <td className="p-3">
                {cat.activo ? (
                  <span className="text-green-400">Activa</span>
                ) : (
                  <span className="text-red-400">Inactiva</span>
                )}
              </td>

              <td className="p-3">
                {canEdit && (
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(cat)}
                      className="text-blue-400 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => onToggle(cat)}
                      className={
                        cat.activo
                          ? 'text-red-400 hover:underline'
                          : 'text-green-400 hover:underline'
                      }
                    >
                      {cat.activo ? 'Desactivar' : 'Reactivar'}
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
