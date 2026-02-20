import type {
  ListarVentasAdminParams,
} from '@/domains/venta/api/venta-admin.api'

interface Props {
  value: ListarVentasAdminParams
  onChange: (
    filters: ListarVentasAdminParams
  ) => void
}

const inputClass = `
  bg-slate-900
  border border-slate-800
  rounded-lg
  px-3 py-2
  text-sm
  text-slate-200
  placeholder:text-slate-500
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500/40
  focus:border-blue-500/40
`

export default function VentasFilters({
  value,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      {/* Estado */}
      <select
        className={inputClass}
        value={value.estado ?? ''}
        onChange={e =>
          onChange({
            ...value,
            estado: (e.target.value || undefined) as
              | 'FINALIZADA'
              | 'ANULADA'
              | undefined,
          })
        }
      >
        <option value="">
          Todos los estados
        </option>
        <option value="FINALIZADA">
          Finalizada
        </option>
        <option value="ANULADA">
          Anulada
        </option>
      </select>

      {/* Tipo documento */}
      <select
        className={inputClass}
        value={value.tipoDocumento ?? ''}
        onChange={e =>
          onChange({
            ...value,
            tipoDocumento: (e.target.value || undefined) as
              | 'BOLETA'
              | 'FACTURA'
              | undefined,
          })
        }
      >
        <option value="">
          Todos los documentos
        </option>
        <option value="BOLETA">
          Boleta
        </option>
        <option value="FACTURA">
          Factura
        </option>
      </select>

      {/* Desde */}
      <input
        type="date"
        className={inputClass}
        value={value.from ?? ''}
        onChange={e =>
          onChange({
            ...value,
            from: e.target.value || undefined,
          })
        }
      />

      {/* Hasta */}
      <input
        type="date"
        className={inputClass}
        value={value.to ?? ''}
        onChange={e =>
          onChange({
            ...value,
            to: e.target.value || undefined,
          })
        }
      />

    </div>
  )
}