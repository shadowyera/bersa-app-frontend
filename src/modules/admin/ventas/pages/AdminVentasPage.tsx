import { useState } from 'react'

import { useAdminVentasQuery } from '@/domains/venta/hooks/useAdminVentasQuery'
import type {
  ListarVentasAdminParams,
} from '@/domains/venta/api/venta-admin.api'

import VentasTable from '../ui/VentasTable'
import VentasFilters from '../ui/VentasFilters'

import { SectionHeader } from '@/shared/ui/section-header/section-header'
import { Card } from '@/shared/ui/card/Card'
import { Button } from '@/shared/ui/button/button'
import { Skeleton } from '@/shared/ui/skeleton/skeleton'

export default function AdminVentasPage() {

  const [filters, setFilters] =
    useState<ListarVentasAdminParams>({
      page: 1,
      limit: 10,
    })

  const { data, isLoading } =
    useAdminVentasQuery(filters)

  const ventas = data?.data ?? []
  const page = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1

  return (
    <section className="p-6 space-y-6">

      {/* ===== Header ===== */}

      <SectionHeader
        title="Ventas"
        subtitle="Historial de ventas del sistema"
      />

      {/* ===== Filtros ===== */}

      <VentasFilters
        value={filters}
        onChange={next =>
          setFilters({
            ...next,
            page: 1,
            limit: 10,
          })
        }
      />

      {/* ===== Tabla ===== */}

      <Card className="p-0 overflow-hidden">

        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ) : (
          <VentasTable ventas={ventas} />
        )}

      </Card>

      {/* ===== Paginación ===== */}

      {data && totalPages > 1 && (

        <div className="flex items-center justify-between">

          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>

          <div className="flex gap-2">

            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  page: prev.page! - 1,
                }))
              }
            >
              ← Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  page: prev.page! + 1,
                }))
              }
            >
              Siguiente →
            </Button>

          </div>

        </div>

      )}

    </section>
  )
}