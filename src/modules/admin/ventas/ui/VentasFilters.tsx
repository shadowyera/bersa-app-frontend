import type {
  ListarVentasAdminParams,
} from '@/domains/venta/api/venta-admin.api'

import { Card } from '@/shared/ui/card/Card'
import { Input } from '@/shared/ui/input/input'
import { Select } from '@/shared/ui/select/select'

interface Props {
  value: ListarVentasAdminParams
  onChange: (
    filters: ListarVentasAdminParams
  ) => void
}

export default function VentasFilters({
  value,
  onChange,
}: Props) {
  return (
    <Card className="p-4">

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* Folio */}
        <Input
          placeholder="Buscar por folio..."
          value={value.folio ?? ''}
          onChange={e =>
            onChange({
              ...value,
              folio: e.target.value || undefined,
            })
          }
        />

        {/* Estado */}
        <Select
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
        </Select>

        {/* Documento */}
        <Select
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
        </Select>

        {/* Desde */}
        <Input
          type="date"
          value={value.from ?? ''}
          onChange={e =>
            onChange({
              ...value,
              from: e.target.value || undefined,
            })
          }
        />

        {/* Hasta */}
        <Input
          type="date"
          value={value.to ?? ''}
          onChange={e =>
            onChange({
              ...value,
              to: e.target.value || undefined,
            })
          }
        />

      </div>

    </Card>
  )
}