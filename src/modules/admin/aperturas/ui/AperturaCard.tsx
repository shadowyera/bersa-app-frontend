import type { AperturaAdmin } from "@/domains/apertura-admin/domain/apertura-admin.types"
import { Link } from 'react-router-dom'

import { useSucursalesQuery } from '@/domains/sucursal/hooks/useSucursalesQuery'
import { useCajasQuery } from '@/domains/caja/hooks/useCajasQuery'

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
    <div
      className="
        p-5
        rounded-xl
        bg-slate-900/40
        hover:bg-slate-900/60
        transition-colors
        border border-slate-800/60
        flex flex-col
      "
    >

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start mb-3">

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Apertura
          </p>

          <p className="text-lg font-semibold text-slate-100">
            {new Date(apertura.fechaApertura)
              .toLocaleString()}
          </p>
        </div>

        <span
          className={`
            text-[11px] font-semibold px-2 py-1 rounded-md
            ${apertura.estado === 'ABIERTA'
              ? 'bg-emerald-600/20 text-emerald-400'
              : 'bg-blue-600/20 text-blue-400'
            }
          `}
        >
          {apertura.estado}
        </span>

      </div>

      {/* ================= CAJA / SUCURSAL ================= */}
      <div className="flex flex-wrap gap-2 text-sm mb-3">

        <span className="px-2 py-1 rounded bg-slate-800/70 text-slate-300">
          {cajaNombre}
        </span>

        <span className="px-2 py-1 rounded bg-slate-800/70 text-slate-300">
          {sucursalNombre}
        </span>

      </div>

      {/* ================= USUARIOS ================= */}
      <div className="grid grid-cols-2 gap-y-1 text-[15px] mb-3">

        <p>
          <span className="text-slate-400">Abrió</span>{' '}
          <span>{apertura.usuarioAperturaNombre || '—'}</span>
        </p>

        {apertura.estado === 'CERRADA' && (
          <p>
            <span className="text-slate-400">Cerró</span>{' '}
            <span>{apertura.usuarioCierreNombre || '—'}</span>
          </p>
        )}

      </div>

      {/* ================= MÉTRICAS ================= */}
      <div className="grid grid-cols-2 gap-y-3 text-base">

        <div>
          <p className="text-sm text-slate-400">
            Ventas
          </p>
          <p className="font-semibold">
            {apertura.totalVentas}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Total
          </p>
          <p className="font-semibold">
            {formatCLP(apertura.totalCobrado)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Ticket promedio
          </p>
          <p className="font-semibold">
            {formatCLP(promedio)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            {duracionLabel}
          </p>
          <p className="font-semibold">
            {duracion}
          </p>
        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-auto pt-4 space-y-3">

        {tieneDiferencia && (
          <div
            className={`
              text-base font-medium
              px-3 py-2 rounded-md
              ${diferenciaPositiva
                ? 'bg-emerald-600/10 text-emerald-400'
                : 'bg-red-600/10 text-red-400'
              }
            `}
          >
            Diferencia: {formatCLP(apertura.diferencia!)}

            {apertura.motivoDiferencia && (
              <div className="text-xs text-slate-400 mt-1">
                Motivo: {apertura.motivoDiferencia}
              </div>
            )}
          </div>
        )}

        <Link
          to={`/admin/aperturas/${apertura.id}`}
          className="
            inline-flex
            items-center
            text-base
            text-emerald-400
            hover:text-emerald-300
          "
        >
          Ver detalle →
        </Link>

      </div>

    </div>
  )
}