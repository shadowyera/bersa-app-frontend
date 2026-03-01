import type { AperturaAdmin } from "@/domains/apertura-admin/domain/apertura-admin.types"
import { Link } from 'react-router-dom'

import { useSucursalesQuery } from '@/domains/sucursal/hooks/useSucursalesQuery'
import { useCajasQuery } from '@/domains/caja/hooks/useCajasQuery'

import { Card } from '@/shared/ui/card/Card'
import { Badge } from '@/shared/ui/badge/badge'

import {
  calcularDuracion,
  calcularPromedio,
  formatCLP,
} from '@/shared/utils/aperturaMetrics'

interface Props {
  apertura: AperturaAdmin
}

export function AperturaCard({ apertura }: Props) {

  const { data: sucursales } = useSucursalesQuery()
  const { data: cajas } = useCajasQuery()

  const sucursalNombre =
    sucursales?.find(
      s => s.id === apertura.sucursalId
    )?.nombre || apertura.sucursalId

  const cajaNombre =
    cajas?.find(
      c => c.id === apertura.cajaId
    )?.nombre || apertura.cajaId

  const duracion = calcularDuracion(
    apertura.fechaApertura,
    apertura.estado === 'CERRADA'
      ? apertura.fechaCierre
      : undefined
  )

  const duracionLabel =
    apertura.estado === 'ABIERTA'
      ? 'Abierta hace'
      : 'Duración'

  const promedio = calcularPromedio(
    apertura.totalCobrado,
    apertura.totalVentas
  )

  const tieneDiferencia =
    typeof apertura.diferencia === 'number' &&
    apertura.diferencia !== 0

  const diferenciaPositiva =
    (apertura.diferencia ?? 0) > 0

  return (
    <Card className="p-5 flex flex-col gap-4 hover:border-primary/40 transition-colors">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start">

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Apertura
          </p>

          <p className="text-lg font-semibold">
            {new Date(apertura.fechaApertura)
              .toLocaleString()}
          </p>
        </div>

        <Badge
          variant={
            apertura.estado === 'ABIERTA'
              ? 'success'
              : 'info'
          }
        >
          {apertura.estado}
        </Badge>

      </div>

      {/* ================= CAJA / SUCURSAL ================= */}
      <div className="flex flex-wrap gap-2 text-sm">

        <Badge variant="outline">
          {cajaNombre}
        </Badge>

        <Badge variant="outline">
          {sucursalNombre}
        </Badge>

      </div>

      {/* ================= USUARIOS ================= */}
      <div className="grid grid-cols-2 gap-y-1 text-sm">

        <p>
          <span className="text-muted-foreground">
            Abrió
          </span>{' '}
          <span>
            {apertura.usuarioAperturaNombre || '—'}
          </span>
        </p>

        {apertura.estado === 'CERRADA' && (
          <p>
            <span className="text-muted-foreground">
              Cerró
            </span>{' '}
            <span>
              {apertura.usuarioCierreNombre || '—'}
            </span>
          </p>
        )}

      </div>

      {/* ================= MÉTRICAS ================= */}
      <div className="grid grid-cols-2 gap-y-3 text-sm">

        <Metric
          label="Ventas"
          value={apertura.totalVentas}
        />

        <Metric
          label="Total"
          value={formatCLP(apertura.totalCobrado)}
        />

        <Metric
          label="Ticket promedio"
          value={formatCLP(promedio)}
        />

        <Metric
          label={duracionLabel}
          value={duracion}
        />

      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-auto space-y-3 pt-2">

        {tieneDiferencia && (
          <div
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              diferenciaPositiva
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
            }`}
          >
            Diferencia: {formatCLP(apertura.diferencia!)}

            {apertura.motivoDiferencia && (
              <div className="text-xs text-muted-foreground mt-1">
                Motivo: {apertura.motivoDiferencia}
              </div>
            )}
          </div>
        )}

        <Link
          to={`/admin/aperturas/${apertura.id}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:opacity-80"
        >
          Ver detalle →
        </Link>

      </div>

    </Card>
  )
}

/* ================= SUB COMPONENT ================= */

function Metric({
  label,
  value,
}: {
  label: string
  value: any
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>
      <p className="font-semibold">
        {value}
      </p>
    </div>
  )
}