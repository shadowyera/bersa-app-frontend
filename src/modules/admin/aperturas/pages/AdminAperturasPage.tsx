import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import AperturasFilters from '../ui/AperturasFilters'
import { AperturaCard } from '../ui/AperturaCard'

import { useAperturasAdminQuery } from '@/domains/apertura-admin/hooks/useAperturasAdminQuery'

export default function AdminAperturasPage() {

  /* ===============================
     Día actual
  =============================== */

  const today = new Date()
    .toISOString()
    .slice(0, 10)

  /* ===============================
     URL Params
  =============================== */

  const [searchParams, setSearchParams] =
    useSearchParams()

  const dayParam =
    searchParams.get('day') ?? today

  const pageParam =
    Number(searchParams.get('page') ?? 1)

  /* ===============================
     State
  =============================== */

  const [day, setDay] =
    useState<string>(dayParam)

  const [page, setPage] =
    useState(pageParam)

  /* ===============================
     Sync URL
  =============================== */

  useEffect(() => {
    setSearchParams({
      day,
      page: String(page),
    })
  }, [day, page, setSearchParams])

  /* ===============================
     Data
  =============================== */

  const { data, isLoading, isError } =
    useAperturasAdminQuery({
      from: day,
      to: day,
      page,
      limit: 10,
    })

  const aperturas =
    data?.data ?? []

  /* ===============================
     Render
  =============================== */

  return (
    <div className="h-full flex flex-col px-6 pt-6 pb-4 text-slate-200">

      {/* Header */}
      <div className="shrink-0 mb-4">
        <h1 className="text-2xl font-semibold">
          Aperturas de Caja
        </h1>

        <p className="text-sm text-slate-400">
          Control y auditoría de turnos de caja
        </p>
      </div>

      {/* Filtro día */}
      <div className="shrink-0 mb-4">
        <AperturasFilters
          value={day}
          onChange={(nextDay) => {
            setDay(nextDay)
            setPage(1)
          }}
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-sm text-slate-400">
          Cargando aperturas...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-sm text-red-400">
          Error al cargar aperturas
        </div>
      )}

      {/* CONTENIDO */}
      {!isLoading && !isError && (
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* SCROLL AREA */}
          <div className="flex-1 overflow-y-auto">

            {aperturas.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-10">
                No hay aperturas para el día seleccionado
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {aperturas.map(a => (
                  <AperturaCard
                    key={a.id}
                    apertura={a}
                  />
                ))}
              </div>
            )}

          </div>

          {/* PAGINACIÓN */}
          {data && data.totalPages > 1 && (
            <div
              className="
                shrink-0
                flex
                justify-end
                items-center
                gap-2
                pt-6
                mt-4
                border-t
                border-slate-800
              "
            >

              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="
                  px-3 py-1 rounded
                  bg-slate-800
                  hover:bg-slate-700
                  disabled:opacity-40
                "
              >
                Anterior
              </button>

              <span className="text-sm text-slate-400 px-2">
                Página {page} de {data.totalPages}
              </span>

              <button
                disabled={page === data.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="
                  px-3 py-1 rounded
                  bg-slate-800
                  hover:bg-slate-700
                  disabled:opacity-40
                "
              >
                Siguiente
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  )
}