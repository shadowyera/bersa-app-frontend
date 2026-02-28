import React, { useEffect, useState } from 'react'
import { api } from '@/shared/api/api'
import { useAuth } from '@/modules/auth/useAuth'

import {
  getProveedorAbastecimiento,
} from '../domain/abastecimiento.logic'

/* ===============================
   Types locales (response API)
=============================== */

interface AbastecimientoItem {
  productoId?: {
    nombre: string
    unidadBase: string
  }
  cantidad: number

  // NUEVO (snapshot 2026)
  proveedorNombre?: string
}

interface AbastecimientoRow {
  _id: string
  fecha: string
  observacion?: string

  // LEGACY (puede venir en datos viejos)
  proveedorId?: {
    nombre: string
  }

  items?: AbastecimientoItem[]
}

interface AbastecimientosResponse {
  data: AbastecimientoRow[]
  total: number
  page: number
  limit: number
}

export const AbastecimientoTable = () => {
  const { user } = useAuth()

  const [rows, setRows] = useState<AbastecimientoRow[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(() => {
    if (!user) return
    cargar(user.sucursal.id, page)
  }, [user, page])

  const cargar = async (sucursalId: string, page: number) => {
    setLoading(true)
    try {
      const res = await api.get<AbastecimientosResponse>(
        `/abastecimientos?sucursalId=${sucursalId}&page=${page}&limit=${limit}`
      )

      // Defensa ante datos legacy
      const safeData = res.data.data.map(a => ({
        ...a,
        items: a.items ?? [],
      }))

      setRows(safeData)
      setTotal(res.data.total)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="text-sm text-slate-400">
        Cargando abastecimientos…
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="text-sm text-slate-400">
        No hay abastecimientos registrados
      </div>
    )
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="py-2 text-left">Fecha</th>
              <th className="py-2 text-left">Productos</th>
              <th className="py-2 text-left">Proveedor</th>
              <th className="py-2 text-left">Observación</th>
              <th className="py-2 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {rows.map(a => {
              const isOpen = expanded === a._id
              const items = a.items ?? []

              /* ===============================
                 PROVEEDOR A MOSTRAR
                 - Prioridad:
                   1) Snapshot nuevo (items)
                   2) Legacy proveedorId
              =============================== */
              const proveedor =
                getProveedorAbastecimiento({
                  items,
                } as any) ??
                a.proveedorId?.nombre ??
                '—'

              return (
                <React.Fragment key={a._id}>
                  {/* FILA PRINCIPAL */}
                  <tr className="border-b border-slate-800">
                    <td className="py-2">
                      {new Date(a.fecha).toLocaleString()}
                    </td>

                    <td className="py-2">
                      {items.length} productos
                    </td>

                    <td className="py-2">
                      {proveedor}
                    </td>

                    <td className="py-2 text-slate-400">
                      {a.observacion ?? '—'}
                    </td>

                    <td className="py-2 text-right">
                      <button
                        onClick={() =>
                          setExpanded(
                            isOpen ? null : a._id
                          )
                        }
                        className="text-xs text-emerald-400 hover:underline"
                      >
                        {isOpen
                          ? 'Ocultar'
                          : 'Ver detalle'}
                      </button>
                    </td>
                  </tr>

                  {/* DETALLE */}
                  {isOpen && (
                    <tr className="bg-slate-900/50">
                      <td colSpan={5} className="px-4 py-3">
                        {items.length === 0 ? (
                          <div className="text-xs text-slate-400">
                            No hay productos asociados
                          </div>
                        ) : (
                          <ul className="space-y-1 text-sm text-slate-300">
                            {items.map((item, idx) => (
                              <li key={idx}>
                                •{' '}
                                {item.productoId?.nombre ??
                                  'Producto eliminado'}{' '}
                                <span className="text-slate-400">
                                  ({item.cantidad}{' '}
                                  {item.productoId?.unidadBase ?? ''})
                                </span>

                                {item.proveedorNombre && (
                                  <span className="ml-2 text-xs text-slate-500">
                                    — {item.proveedorNombre}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINADOR */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Página {page} de {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="rounded bg-slate-700 px-2 py-1 text-sm text-slate-200 disabled:opacity-40"
            >
              ←
            </button>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="rounded bg-slate-700 px-2 py-1 text-sm text-slate-200 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}