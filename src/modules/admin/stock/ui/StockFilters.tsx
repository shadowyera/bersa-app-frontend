/* =====================================================
   TIPOS
===================================================== */

export type ProveedorFiltro =
  | 'TODOS'
  | 'SIN_PROVEEDOR'
  | string

export interface ProveedorOption {
  id: string
  nombre: string
}

interface Props {
  proveedores: ProveedorOption[]

  proveedorValue: ProveedorFiltro
  onProveedorChange: (v: ProveedorFiltro) => void

  searchValue: string
  onSearchChange: (v: string) => void
}

/* =====================================================
   COMPONENTE
===================================================== */

export function StockFilters({
  proveedores,
  proveedorValue,
  onProveedorChange,
  searchValue,
  onSearchChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 items-center">

      <select
        value={proveedorValue}
        onChange={(e) =>
          onProveedorChange(e.target.value as ProveedorFiltro)
        }
        className="
  bg-slate-900
  border border-slate-800
  rounded-lg
  px-3 py-2
  text-sm
  text-slate-200
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500/40
  focus:border-blue-500/40
  transition
"
      >
        <option value="TODOS">
          Todos los proveedores
        </option>

        <option value="SIN_PROVEEDOR">
          Sin proveedor
        </option>

        {proveedores.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={searchValue}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        className="
  bg-slate-900
  border border-slate-800
  rounded-lg
  px-3 py-2
  text-sm
  w-64
  text-slate-200
  placeholder:text-slate-500
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500/40
  focus:border-blue-500/40
  transition
"
      />
    </div>
  )
}