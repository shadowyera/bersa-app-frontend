import { Button } from '@/shared/ui/button/button'
import { Input } from '@/shared/ui/input/input'
import { Label } from '@/shared/ui/label/label'

interface Props {
  value: string
  onChange: (day: string) => void
}

function getToday() {
  return new Date()
    .toISOString()
    .slice(0, 10)
}

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export default function AperturasFilters({
  value,
  onChange,
}: Props) {

  const today = getToday()
  const yesterday = getYesterday()

  const isToday = value === today

  return (
    <div className="flex flex-wrap items-end gap-6">

      {/* Día */}
      <div className="flex flex-col gap-2">

        <Label>Día</Label>

        <Input
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-44"
        />

      </div>

      {/* Accesos rápidos */}
      <div className="flex flex-col gap-2">

        <Label>Accesos rápidos</Label>

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(today)}
          >
            Hoy
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(yesterday)}
          >
            Ayer
          </Button>

          {!isToday && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onChange(today)}
            >
              Ir a hoy
            </Button>
          )}

        </div>

      </div>

    </div>
  )
}