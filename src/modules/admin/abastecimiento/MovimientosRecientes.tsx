import { useEffect, useState } from 'react'
import { api } from '@/shared/api/api'

interface Movimiento {
  _id: string
  tipoMovimiento: 'INGRESO' | 'EGRESO'
  subtipoMovimiento: string
  cantidad: number
  fecha: string
}

interface MovimientosResponse {
  data: Movimiento[]
  total: number
  page: number
  limit: number
}

export default function MovimientosRecientes({
  sucursalId,
}: {
  sucursalId: string
}) {
  const [data, setData] = useState<Movimiento[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sucursalId) return

    setLoading(true)

    api
      .get<MovimientosResponse>(
        `/movimientos/sucursal/${sucursalId}?page=${page}&limit=${limit}`
      )
      .then(res => {
        // 🔑 CLAVE: leer exactamente esta forma
        setData(res.data.data)
        setTotal(res.data.total)
      })
      .finally(() => setLoading(false))
  }, [sucursalId, page, limit])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-300">
        Movimientos recientes
      </h3>

      {loading && (
        <div className="text-sm text-slate-400">
          Cargando movimientos…
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="text-sm text-slate-400">
          No hay movimientos registrados
        </div>
      )}

      <div className="space-y-1">
        {data.map(m => (
          <div
            key={m._id}
            className="
              flex justify-between items-center
              bg-slate-800 text-slate-200
              px-3 py-2 rounded text-sm
            "
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {m.subtipoMovimiento}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(m.fecha).toLocaleString()}
              </span>
            </div>

            <span
              className={
                m.tipoMovimiento === 'INGRESO'
                  ? 'text-emerald-400 font-semibold'
                  : 'text-red-400 font-semibold'
              }
            >
              {m.tipoMovimiento === 'INGRESO' ? '+' : '-'}
              {m.cantidad}
            </span>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400">
            Página {page} de {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="
                px-2 py-1 text-sm rounded
                bg-slate-700 text-slate-200
                disabled:opacity-40
              "
            >
              ←
            </button>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="
                px-2 py-1 text-sm rounded
                bg-slate-700 text-slate-200
                disabled:opacity-40
              "
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}