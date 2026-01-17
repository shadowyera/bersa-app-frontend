import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getSucursales,
  getStockPorSucursal,
  setStockHabilitado,
} from '@/shared/api/stock.api'

import type {
  StockProducto,
  Sucursal,
} from '@/shared/types/stock.types'

import StockTable from './StockTable'
import ConfirmDeactivateModal from '../ConfirmDeactivateModal'

export default function StockPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const canEdit =
    user?.rol === 'ADMIN' || user?.rol === 'ENCARGADO'

  /* =====================================================
     UI STATE (solo UI)
  ===================================================== */

  const [sucursalId, setSucursalId] = useState('')
  const [search, setSearch] = useState('')
  const [onlyLow, setOnlyLow] = useState(false)

  const [toToggle, setToToggle] =
    useState<StockProducto | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  /* =====================================================
     QUERY: Sucursales
  ===================================================== */

  const {
    data: sucursales = [],
    isLoading: loadingSucursales,
  } = useQuery<Sucursal[]>({
    queryKey: ['sucursales'],
    queryFn: getSucursales,
    staleTime: 10 * 60 * 1000,
  })

  /* =====================================================
     QUERY: Stock por sucursal
     (clave dependiente de sucursalId)
  ===================================================== */

  const {
    data: stock = [],
    isLoading: loadingStock,
  } = useQuery<StockProducto[]>({
    queryKey: ['stock', sucursalId],
    queryFn: () => getStockPorSucursal(sucursalId),
    enabled: Boolean(sucursalId), // 🔑 no dispara sin sucursal
    refetchInterval: 30_000, // opcional (stock semi-vivo)
  })

  /* =====================================================
     MUTATION: Activar / desactivar venta
  ===================================================== */

  const toggleStock = useMutation({
    mutationFn: async (item: StockProducto) => {
      return setStockHabilitado(
        item._id,
        !item.habilitado
      )
    },
    onSuccess: () => {
      // refresca solo el stock de la sucursal actual
      queryClient.invalidateQueries({
        queryKey: ['stock', sucursalId],
      })
      setConfirmOpen(false)
      setToToggle(null)
    },
  })

  /* =====================================================
     FILTERS (correctamente memorizados)
  ===================================================== */

  const filtered = useMemo(() => {
    return stock.filter(item => {
      const producto = item.productoId
      if (!producto) return false

      const text =
        `${producto.nombre} ${producto.codigo}`.toLowerCase()

      if (search && !text.includes(search.toLowerCase()))
        return false

      if (onlyLow && item.cantidad > 5) return false

      return true
    })
  }, [stock, search, onlyLow])

  useEffect(() => {
    if (!sucursalId && sucursales.length > 0) {
      setSucursalId(sucursales[0]._id)
    }
  }, [sucursales, sucursalId])

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">
        Stock por sucursal
      </h1>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <select
          value={sucursalId}
          onChange={e => setSucursalId(e.target.value)}
          className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          disabled={loadingSucursales}
        >
          {sucursales.map(s => (
            <option key={s._id} value={s._id}>
              {s.nombre}
            </option>
          ))}
        </select>

        <input
          className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          placeholder="Buscar producto o código"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyLow}
            onChange={e => setOnlyLow(e.target.checked)}
          />
          Solo stock bajo
        </label>
      </div>

      {/* Tabla */}
      <StockTable
        stock={filtered}
        loading={loadingStock}
        canEdit={canEdit}
        onToggle={item => {
          setToToggle(item)
          setConfirmOpen(true)
        }}
      />

      {/* Confirmación */}
      <ConfirmDeactivateModal
        open={confirmOpen}
        loading={toggleStock.isPending}
        title={
          toToggle?.habilitado
            ? 'Desactivar venta'
            : 'Activar venta'
        }
        description={
          toToggle?.habilitado
            ? `¿Deseas desactivar la venta de "${toToggle?.productoId?.nombre}" en esta sucursal?`
            : `¿Deseas activar la venta de "${toToggle?.productoId?.nombre}" en esta sucursal?`
        }
        confirmLabel={
          toToggle?.habilitado ? 'Desactivar' : 'Activar'
        }
        onCancel={() => {
          setConfirmOpen(false)
          setToToggle(null)
        }}
        onConfirm={() => {
          if (toToggle) toggleStock.mutate(toToggle)
        }}
      />
    </div>
  )
}