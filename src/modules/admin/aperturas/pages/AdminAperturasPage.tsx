import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/shared/ui/button/button'

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
    <section className="h-full flex flex-col px-6 pt-6 pb-4 gap-6">

      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl font-semibold">
          Aperturas de Caja
        </h1>

        <p className="text-sm text-muted-foreground">
          Control y auditoría de turnos de caja
        </p>
      </div>

      {/* ================= FILTRO ================= */}

      <AperturasFilters
        value={day}
        onChange={(nextDay) => {
          setDay(nextDay)
          setPage(1)
        }}
      />

      {/* ================= LOADING ================= */}

      {isLoading && (
        <div className="text-sm text-muted-foreground">
          Cargando aperturas...
        </div>
      )}

      {/* ================= ERROR ================= */}

      {isError && (
        <div className="text-sm text-danger">
          Error al cargar aperturas
        </div>
      )}

      {/* ================= CONTENIDO ================= */}

      {!isLoading && !isError && (
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* SCROLL AREA */}
          <div className="flex-1 overflow-y-auto">

            {aperturas.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-10">
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

          {/* ================= PAGINACIÓN ================= */}

          {data && data.totalPages > 1 && (
            <div className="shrink-0 flex justify-end items-center gap-4 pt-6 mt-4 border-t border-border">

              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Anterior
              </Button>

              <span className="text-sm text-muted-foreground">
                Página {page} de {data.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page === data.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Siguiente
              </Button>

            </div>
          )}

        </div>
      )}

    </section>
  )
}