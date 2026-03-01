import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useAperturaAdminDetalleQuery } from '@/domains/apertura-admin/hooks/useAperturaAdminDetalleQuery'
import { formatCLP, calcularDuracion } from '@/shared/utils/aperturaMetrics'

import { Button } from '@/shared/ui/button/button'
import { Badge } from '@/shared/ui/badge/badge'
import { Card } from '@/shared/ui/card/Card'

import {
  Table,
  TableContent,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/ui/table/table'

import {
  AdminAperturaDetalleFilters,
  type AperturaDetalleFilters,
} from '../ui/AdminAperturaDetalleFilters'

const ROW_HEIGHT = 48

export default function AdminAperturaDetallePage() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] =
    useState<AperturaDetalleFilters>({})

  const tableScrollRef =
    useRef<HTMLDivElement | null>(null)

  const {
    data,
    isLoading,
    isError,
  } = useAperturaAdminDetalleQuery(id!)

  const duracion = data
    ? calcularDuracion(
        data.fechaApertura,
        data.estado === 'CERRADA'
          ? data.fechaCierre
          : undefined
      )
    : ''

  /* ================= LIMIT DINÁMICO ================= */

  useEffect(() => {
    const calcularLimit = () => {
      if (!tableScrollRef.current) return

      const height =
        tableScrollRef.current.clientHeight

      if (!height) return

      const rows =
        Math.max(5, Math.floor(height / ROW_HEIGHT))

      setLimit(prev =>
        prev !== rows ? rows : prev
      )
    }

    requestAnimationFrame(calcularLimit)
    setTimeout(calcularLimit, 0)

    window.addEventListener('resize', calcularLimit)

    return () => {
      window.removeEventListener(
        'resize',
        calcularLimit
      )
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [limit, filters])

  /* ================= FILTRADO ================= */

  const ventasFiltradas = useMemo(() => {
    if (!data) return []

    return data.ventas.filter(v => {

      if (filters.estado && v.estado !== filters.estado)
        return false

      if (
        filters.documento &&
        v.documentoTributario?.tipo !== filters.documento
      )
        return false

      if (
        filters.pago &&
        !v.pagos?.some(p => p.tipo === filters.pago)
      )
        return false

      if (
        filters.search &&
        !v.folio
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      )
        return false

      return true
    })
  }, [data, filters])

  const totalPages = Math.max(
    1,
    Math.ceil(ventasFiltradas.length / limit)
  )

  const ventasPagina = ventasFiltradas.slice(
    (page - 1) * limit,
    page * limit
  )

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="p-10 text-muted-foreground">
        Cargando apertura...
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-10 text-muted-foreground">
        Apertura no encontrada
      </div>
    )
  }

  /* ================= RENDER ================= */

  return (
    <section className="p-6 h-full flex flex-col gap-5">

      {/* ===== HEADER ===== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            ←
          </Button>

          <div>
            <h1 className="text-xl font-semibold">
              Apertura de Caja
            </h1>

            <p className="text-sm text-muted-foreground">
              {new Date(
                data.fechaApertura
              ).toLocaleString()}
            </p>
          </div>

        </div>

        <Badge
          variant={
            data.estado === 'ABIERTA'
              ? 'success'
              : 'outline'
          }
        >
          {data.estado}
        </Badge>

      </div>

      {/* ===== STATS ===== */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <CompactStat
          label="Ventas"
          value={data.totalVentas}
        />

        <CompactStat
          label="Total cobrado"
          value={formatCLP(data.totalCobrado)}
        />

        <CompactStat
          label="Diferencia"
          value={formatCLP(data.diferencia || 0)}
          highlight={data.diferencia !== 0}
        />

        <CompactStat
          label={
            data.estado === 'ABIERTA'
              ? 'Activa'
              : 'Duración'
          }
          value={duracion}
        />

        <CompactStat
          label="Responsables"
          value={`${data.usuarioAperturaNombre ?? '—'} → ${data.usuarioCierreNombre ?? '—'}`}
        />

      </div>

      {/* ===== FILTROS (compactos) ===== */}

      <AdminAperturaDetalleFilters
        onChange={(f) => setFilters({ ...f })}
      />

      {/* ===== TABLA ===== */}

      <Table className="flex-1 flex flex-col overflow-hidden mt-1">

        <div
          ref={tableScrollRef}
          className="flex-1 overflow-auto"
        >

          <TableContent>

            <TableHeader className="sticky top-0 z-10 bg-surface border-b border-border">

              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Folio</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead className="text-right">
                  Total
                </TableHead>
                <TableHead className="text-center">
                  Estado
                </TableHead>
                <TableHead className="text-right">
                  Acción
                </TableHead>
              </TableRow>

            </TableHeader>

            <TableBody>

              {ventasPagina.map((v, i) => (

                <TableRow key={v.id}>

                  <TableCell className="text-muted-foreground">
                    {(page - 1) * limit + i + 1}
                  </TableCell>

                  <TableCell className="font-mono">
                    {v.folio}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {new Date(
                      v.createdAt
                    ).toLocaleTimeString()}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        v.documentoTributario?.tipo === 'FACTURA'
                          ? 'info'
                          : 'success'
                      }
                    >
                      {v.documentoTributario?.tipo}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {v.pagos?.map((p, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                        >
                          {p.tipo}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {formatCLP(v.totalCobrado)}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={
                        v.estado === 'ANULADA'
                          ? 'danger'
                          : 'outline'
                      }
                    >
                      {v.estado}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Link
                      to={`/admin/ventas/${v.id}`}
                      className="text-primary hover:opacity-80"
                    >
                      Ver
                    </Link>
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </TableContent>

        </div>

      </Table>

      {/* ===== PAGINACIÓN ===== */}

      {totalPages > 1 && (

        <div className="flex justify-between items-center">

          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>

          <div className="flex gap-2">

            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Siguiente →
            </Button>

          </div>

        </div>

      )}

    </section>
  )
}

/* ================= STAT ================= */

function CompactStat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: any
  highlight?: boolean
}) {
  return (
    <Card className="p-4">

      <div className="space-y-1">

        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <p
          className={`text-lg font-semibold truncate ${
            highlight ? 'text-success' : ''
          }`}
        >
          {value}
        </p>

      </div>

    </Card>
  )
}