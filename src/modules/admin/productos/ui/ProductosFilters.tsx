import { FilterBar } from '@/shared/ui/filter-bar/filter-bar'
import { Input } from '@/shared/ui/input/input'
import { Select } from '@/shared/ui/select/select'
import { Badge } from '@/shared/ui/badge/badge'

type EstadoFiltro = 'TODOS' | 'ACTIVOS' | 'INACTIVOS'

type ProveedorOption = {
  id: string
  nombre: string
}

type Props = {
  search: string
  estado: EstadoFiltro
  proveedorId?: string
  proveedores: ProveedorOption[]
  total: number

  onSearchChange: (value: string) => void
  onEstadoChange: (value: EstadoFiltro) => void
  onProveedorChange: (value?: string) => void
}

export default function ProductosFilters({
  search,
  estado,
  proveedorId,
  proveedores,
  total,
  onSearchChange,
  onEstadoChange,
  onProveedorChange,
}: Props) {
  return (
    <FilterBar className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      {/* Izquierda: filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Búsqueda */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Buscar por nombre o código..."
            value={search}
            onChange={e =>
              onSearchChange(e.target.value)
            }
          />
        </div>

        {/* Proveedor */}
        <div className="w-full md:w-56">
          <Select
            value={proveedorId ?? 'TODOS'}
            onChange={e => {
              const value = e.target.value
              onProveedorChange(
                value === 'TODOS'
                  ? undefined
                  : value
              )
            }}
          >
            <option value="TODOS">
              Todos los proveedores
            </option>

            {proveedores.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Select>
        </div>

        {/* Estado */}
        <div className="w-full md:w-44">
          <Select
            value={estado}
            onChange={e =>
              onEstadoChange(
                e.target.value as EstadoFiltro
              )
            }
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVOS">
              Activos
            </option>
            <option value="INACTIVOS">
              Inactivos
            </option>
          </Select>
        </div>
      </div>

      {/* Derecha: contador */}
      <div className="flex items-center">
        <Badge variant="info">
          {total} resultado
          {total === 1 ? '' : 's'}
        </Badge>
      </div>
    </FilterBar>
  )
}