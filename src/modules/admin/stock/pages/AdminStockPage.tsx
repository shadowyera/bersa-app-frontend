import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/modules/auth/useAuth'
import { useSucursalesQuery } from '@/domains/sucursal/hooks/useSucursalesQuery'

import { useAdminStockQuery } from '@/domains/stock/hooks/useAdminStockQuery'
import { useAjustarStockMutation } from '@/domains/stock/hooks/useAjustarStockMutation'

import {
  getEstadoStock,
} from '@/domains/stock/domain/stock.utils'

import {
  STOCK_LIMITE_BAJO_DEFAULT,
} from '@/domains/stock/domain/stock.constants'

import type {
  EstadoStock,
} from '@/domains/stock/domain/stock.types'

import { StockEstadoButtons } from '../ui/StockEstadoButtons'
import { StockFilters, type ProveedorFiltro } from '../ui/StockFilters';
import AdminStockTable from '../ui/AdminStockTable'
import { StockAjusteModal } from '../ui/StockAjusteModal'

/* =====================================================
   TIPOS
===================================================== */

type EstadoFiltro = 'TODOS' | EstadoStock

/* =====================================================
   COMPONENTE
===================================================== */

export default function AdminStockPage() {

  const { user } = useAuth()

  const puedeElegirSucursal =
    user?.sucursal?.esPrincipal ?? false

  /* ===============================
     URL PARAMS
  =============================== */

  const [searchParams, setSearchParams] =
    useSearchParams()

  const sucursalId =
    searchParams.get('sucursalId') ??
    user?.sucursal?.id ??
    ''

  /* ===============================
     DATA
  =============================== */

  const {
    data = [],
    isLoading,
    isError,
  } = useAdminStockQuery(sucursalId)

  const { data: sucursales = [] } =
    useSucursalesQuery({
      enabled: puedeElegirSucursal,
    })

  const ajusteMutation =
    useAjustarStockMutation(sucursalId)

  /* ===============================
     FILTROS
  =============================== */

  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] =
    useState<EstadoFiltro>('TODOS')

  const [proveedorFilter, setProveedorFilter] =
    useState<ProveedorFiltro>('TODOS')

  /* ===============================
     AJUSTE
  =============================== */

  const [selectedStockId, setSelectedStockId] =
    useState<string | null>(null)

  /* ===============================
     PROVEEDORES ÚNICOS
  =============================== */

  const proveedoresUnicos = useMemo(() => {
    const map = new Map<string, string>()

    data.forEach(item => {
      if (item.proveedorId && item.proveedorNombre) {
        map.set(item.proveedorId, item.proveedorNombre)
      }
    })

    return Array.from(map.entries()).map(
      ([id, nombre]) => ({ id, nombre })
    )
  }, [data])

  /* ===============================
     CONTEO ESTADOS
  =============================== */

  const conteoEstados = useMemo(() => {
    const base: Record<EstadoStock, number> = {
      NEGATIVO: 0,
      SIN_STOCK: 0,
      BAJO: 0,
      OK: 0,
    }

    data.forEach(item => {
      const estado =
        getEstadoStock(
          item,
          STOCK_LIMITE_BAJO_DEFAULT
        )

      base[estado]++
    })

    return base
  }, [data])

  /* ===============================
     DATA DERIVADA
  =============================== */

  const items = useMemo(() => {

    return data
      .map(item => ({
        ...item,
        estado: getEstadoStock(
          item,
          STOCK_LIMITE_BAJO_DEFAULT
        ),
      }))
      .filter(item => {

        const matchSearch =
          item.nombreProducto
            .toLowerCase()
            .includes(search.toLowerCase())

        const matchEstado =
          estadoFilter === 'TODOS'
            ? true
            : item.estado === estadoFilter

        const matchProveedor =
          proveedorFilter === 'TODOS'
            ? true
            : proveedorFilter === 'SIN_PROVEEDOR'
              ? !item.proveedorId
              : item.proveedorId === proveedorFilter

        return (
          matchSearch &&
          matchEstado &&
          matchProveedor
        )
      })

  }, [
    data,
    search,
    estadoFilter,
    proveedorFilter,
  ])

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="h-full flex flex-col px-6 pt-6 pb-4 text-slate-200">

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-end">

        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Administración de Stock
          </h1>

          <p className="text-sm text-slate-400">
            Control, auditoría y ajustes manuales
          </p>
        </div>

        {puedeElegirSucursal && (
          <div className="w-full md:w-64">
            <select
              className="
                w-full
                bg-slate-900
                border border-slate-800
                rounded-lg
                px-3 py-2
                text-sm
                text-slate-200
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/40
                focus:border-blue-500/40
                transition
              "
              value={sucursalId}
              onChange={(e) => {
                const params =
                  new URLSearchParams(searchParams)

                params.set(
                  'sucursalId',
                  e.target.value
                )

                setSearchParams(params)
              }}
            >
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* ================= ESTADOS ================= */}

      <div className="mb-4">
        <StockEstadoButtons
          value={estadoFilter}
          onChange={setEstadoFilter}
          conteo={conteoEstados}
        />
      </div>

      {/* ================= FILTROS ================= */}

      <div className="mb-4">
        <StockFilters
          searchValue={search}
          onSearchChange={setSearch}
          proveedorValue={proveedorFilter}
          onProveedorChange={setProveedorFilter}
          proveedores={proveedoresUnicos}
        />
      </div>

      {/* ================= LOADING ================= */}

      {isLoading && (
        <div className="text-sm text-slate-400">
          Cargando stock...
        </div>
      )}

      {/* ================= ERROR ================= */}

      {isError && (
        <div className="text-sm text-red-400">
          Error al cargar stock
        </div>
      )}

      {/* ================= TABLA ================= */}

      {!isLoading && !isError && (
        <div className="flex-1 overflow-y-auto">
          <AdminStockTable
            items={items}
            onAjustar={(stockId) =>
              setSelectedStockId(stockId)
            }
          />
        </div>
      )}

      {/* ================= MODAL ================= */}

      <StockAjusteModal
        open={Boolean(selectedStockId)}
        onClose={() =>
          setSelectedStockId(null)
        }
        onConfirm={(cantidad, motivo) => {

          if (!selectedStockId) return

          ajusteMutation.mutate({
            stockId: selectedStockId,
            cantidad,
            motivo,
          })

          setSelectedStockId(null)
        }}
      />

    </div>
  )
}