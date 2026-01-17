import { useEffect, useState } from 'react'
import { api } from '@/shared/api/api'
import { useAuth } from '@/modules/auth/useAuth'

interface MovimientoRow {
  _id: string
  tipoMovimiento: 'INGRESO' | 'EGRESO'
  subtipoMovimiento: string

  productoId?: {
    nombre: string
  }

  sucursalId?: {
    nombre: string
  }

  cantidad: number
  saldoAnterior: number
  saldoPosterior: number
  observacion?: string
  fecha: string
}

interface MovimientosResponse {
  data: MovimientoRow[]
  total: number
  page: number
  limit: number
}

export default function AbastecimientoTable() {
  const { user } = useAuth()
  const [rows, setRows] = useState<MovimientoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  useEffect(() => {
    if (!user) return
    cargar(user.sucursalId, page)
  }, [user, page])

  const cargar = async (sucursalId: string, page: number) => {
    setLoading(true)
    try {
      const res = await api.get<MovimientosResponse>(
        `/movimientos/sucursal/${sucursalId}?page=${page}&limit=${limit}`
      )

      setRows(res.data.data)   // 👈 CLAVE
      setTotal(res.data.total)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="text-sm text-slate-400">
        Cargando movimientos…
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="text-sm text-slate-400">
        No hay movimientos registrados
      </div>
    )
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="py-2 text-left">Fecha</th>
              <th className="py-2 text-left">Producto</th>
              <th className="py-2 text-left">Tipo</th>
              <th className="py-2 text-right">Cantidad</th>
              <th className="py-2 text-right">Saldo</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(m => {
              const ingreso = m.tipoMovimiento === 'INGRESO'

              return (
                <tr
                  key={m._id}
                  className="border-b border-slate-800"
                >
                  <td className="py-2">
                    {new Date(m.fecha).toLocaleString()}
                  </td>

                  <td className="py-2">
                    {m.productoId?.nombre ?? '—'}
                  </td>

                  <td className="py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        ingreso
                          ? 'bg-emerald-600/20 text-emerald-400'
                          : 'bg-red-600/20 text-red-400'
                      }`}
                    >
                      {m.subtipoMovimiento}
                    </span>
                  </td>

                  <td
                    className={`py-2 text-right font-medium ${
                      ingreso
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {ingreso ? '+' : '-'}
                    {m.cantidad}
                  </td>

                  <td className="py-2 text-right text-slate-400">
                    {m.saldoAnterior} → {m.saldoPosterior}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINADOR */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Página {page} de {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="px-2 py-1 text-sm rounded bg-slate-700 text-slate-200 disabled:opacity-40"
            >
              ←
            </button>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="px-2 py-1 text-sm rounded bg-slate-700 text-slate-200 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}