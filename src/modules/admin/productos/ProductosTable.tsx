import type { Producto } from '../../../domains/producto/domain/producto.types';


type Props = {
  productos: Producto[]
  loading?: boolean
  canEdit: boolean
  onEdit: (producto: Producto) => void
  onToggle: (producto: Producto) => void
}

/**
 * Tabla de productos (ADMIN)
 * - Componente 100% presentacional
 * - No hace fetch
 * - No conoce React Query
 * - Renderiza según props
 */
export default function ProductosTable({
  productos,
  loading = false,
  canEdit,
  onEdit,
  onToggle,
}: Props) {
  /**
   * Helper local para mostrar nombre de proveedor
   * - Soporta populate (objeto)
   * - Soporta solo ID (string)
   * - Evita repetir lógica en JSX
   */
  const getProveedorNombre = (
    proveedor?: string | { nombre: string }
  ) => {
    if (!proveedor || typeof proveedor === 'string') {
      return '—'
    }
    return proveedor.nombre
  }

  return (
    <div className="rounded-lg border border-slate-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3 text-left">Código</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Proveedor</th>
            <th className="p-3 text-left">Precio</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 w-40"></th>
          </tr>
        </thead>

        <tbody>
          {/* Loading */}
          {loading && (
            <tr>
              {/* 👇 colSpan corregido (6 columnas reales) */}
              <td
                colSpan={6}
                className="p-4 text-center text-slate-400"
              >
                Cargando productos…
              </td>
            </tr>
          )}

          {/* Empty state */}
          {!loading && productos.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="p-4 text-center text-slate-400"
              >
                No hay productos
              </td>
            </tr>
          )}

          {/* Rows */}
          {productos.map(prod => (
            <tr
              key={prod.id}
              className={`border-t border-slate-800 ${
                prod.activo ? '' : 'opacity-60'
              }`}
            >
              {/* Código */}
              <td className="p-3 text-slate-400">
                {prod.codigo || '—'}
              </td>

              {/* Nombre */}
              <td className="p-3 font-medium">
                {prod.nombre}
              </td>

              {/* Proveedor */}
              <td className="p-3 text-slate-400 italic">
                {getProveedorNombre(prod.proveedorId)}
              </td>

              {/* Precio */}
              <td className="p-3 text-slate-300">
                ${prod.precio.toLocaleString('es-CL')}
              </td>

              {/* Estado */}
              <td className="p-3">
                {prod.activo ? (
                  <span className="text-green-400">
                    Activo
                  </span>
                ) : (
                  <span className="text-red-400">
                    Inactivo
                  </span>
                )}
              </td>

              {/* Acciones */}
              <td className="p-3">
                {canEdit && (
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(prod)}
                      className="text-blue-400 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => onToggle(prod)}
                      className={
                        prod.activo
                          ? 'text-red-400 hover:underline'
                          : 'text-green-400 hover:underline'
                      }
                    >
                      {prod.activo
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