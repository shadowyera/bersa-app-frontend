import { useState } from 'react'

import { useAdminVentasQuery } from '@/domains/venta/hooks/useAdminVentasQuery'
import type {
  ListarVentasAdminParams,
} from '@/domains/venta/api/venta-admin.api'

import VentasTable from '../ui/VentasTable'
import VentasFilters from '../ui/VentasFilters'

export default function AdminVentasPage() {

  const [filters, setFilters] =
    useState<ListarVentasAdminParams>({
      page: 1,
      limit: 10,
    })

  const { data, isLoading, error } =
    useAdminVentasQuery(filters)

  const ventas = data?.data ?? []
  const page = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1

  return (
    <section className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Ventas
          </h1>
          <p className="text-sm text-muted-foreground">
            Historial de ventas del sistema
          </p>
        </div>
      </div>

      {/* Filtros */}
      <VentasFilters
        value={filters}
        onChange={next => {
          setFilters({
            ...next,
            page: 1, // reset al filtrar
            limit: 10,
          })
        }}
      />

      {/* Estados */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Cargando ventas...
        </p>
      )}

      {error && (
        <pre className="text-xs text-red-500">
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      {/* Tabla */}
      {!isLoading && (
        <VentasTable ventas={ventas} />
      )}

      {/* Paginación */}
      {data && totalPages > 1 && (
        <div
          className="
            flex
            items-center
            justify-between
            pt-2
          "
        >

          {/* Info */}
          <p className="text-sm text-slate-400">
            Página {page} de {totalPages}
          </p>

          {/* Controles */}
          <div className="flex gap-2">

            <button
              disabled={page === 1}
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  page: prev.page! - 1,
                }))
              }
              className="
                px-3 py-1.5
                rounded-lg
                border border-slate-800
                text-sm
                text-slate-300
                hover:bg-slate-800
                disabled:opacity-40
                disabled:hover:bg-transparent
              "
            >
              ← Anterior
            </button>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  page: prev.page! + 1,
                }))
              }
              className="
                px-3 py-1.5
                rounded-lg
                border border-slate-800
                text-sm
                text-slate-300
                hover:bg-slate-800
                disabled:opacity-40
                disabled:hover:bg-transparent
              "
            >
              Siguiente →
            </button>

          </div>
        </div>
      )}

    </section>
  )
}