import type { Proveedor } from '@/shared/types/proveedor.types'

type Props = {
  proveedores: Proveedor[]
  loading?: boolean
  canEdit: boolean
  onEdit: (proveedor: Proveedor) => void
  onToggle: (proveedor: Proveedor) => void
}

export default function ProveedoresTable({
  proveedores,
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
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 w-40"></th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={3}
                className="p-4 text-center text-slate-400"
              >
                Cargando proveedores...
              </td>
            </tr>
          )}

          {!loading && proveedores.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="p-4 text-center text-slate-400"
              >
                No hay proveedores
              </td>
            </tr>
          )}

          {proveedores.map(prov => (
            <tr
              key={prov._id}
              className={`border-t border-slate-800 ${
                !prov.activo ? 'opacity-60' : ''
              }`}
            >
              <td className="p-3 font-medium">
                {prov.nombre}
              </td>

              <td className="p-3">
                {prov.activo ? (
                  <span className="text-green-400">
                    Activo
                  </span>
                ) : (
                  <span className="text-red-400">
                    Inactivo
                  </span>
                )}
              </td>

              <td className="p-3">
                {canEdit && (
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(prov)}
                      className="text-blue-400 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => onToggle(prov)}
                      className={
                        prov.activo
                          ? 'text-red-400 hover:underline'
                          : 'text-green-400 hover:underline'
                      }
                    >
                      {prov.activo
                        ? 'Desactivar'
                        : 'Reactivar'}
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