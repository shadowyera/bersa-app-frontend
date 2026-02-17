import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useSucursalContext } from '../../../sucursales/useSucursalContext'
import { useSucursales } from '@/shared/hooks/useSucursales'
import { usePedidos } from '../../hooks/usePedidos'
import { usePedidoMutations } from '../../hooks/usePedidoMutations'

import { PedidosTable } from './PedidosTable'
import { PedidoDetalleModal } from './PedidoDetalleModal'

import type { PedidoInterno } from '../../domain/types/pedido.types'
import type {
  ContextoPedidoRol,
} from '../../domain/core/pedido-roles'

/* =====================================================
   Constantes
===================================================== */

const PAGE_SIZE = 10

type VistaPedidos = 'mios' | 'recibidos'

/* =====================================================
   Page
===================================================== */

export default function PedidosPage() {
  const navigate = useNavigate()
  const location = useLocation()

  /* ===============================
     Contexto sucursal
  =============================== */

  const { data: sucursal } = useSucursalContext()
  const isSucursalMain = sucursal?.esPrincipal === true

  const { sucursales } = useSucursales()

  /* ===============================
     Data
  =============================== */

  const {
    pedidosMios,
    pedidosMiosLoading,
    pedidosMiosError,
    pedidosRecibidos,
    pedidosRecibidosLoading,
    pedidosRecibidosError,
  } = usePedidos()

  const {
    cancelarPedido,
    cancelandoPedido,
    despacharPedido,
  } = usePedidoMutations()


  /* ===============================
     UI state
  =============================== */

  const [vista, setVista] =
    useState<VistaPedidos>(
      isSucursalMain ? 'recibidos' : 'mios'
    )

  const [pedidoDetalle, setPedidoDetalle] =
    useState<PedidoInterno | null>(null)

  const [highlightId, setHighlightId] =
    useState<string | null>(null)

  const [page, setPage] = useState(1)

  const [sucursalFiltroId, setSucursalFiltroId] =
    useState<string>('ALL')

  /* ===============================
     Contexto de rol (dominio)
  =============================== */

  const contextoRol: ContextoPedidoRol =
    useMemo(
      () => ({
        esSucursalMain: isSucursalMain,
      }),
      [isSucursalMain]
    )

  /* ===============================
     Highlight desde navegación
  =============================== */

  useEffect(() => {
    const id =
      location.state?.highlightPedidoId

    if (!id) return

    setHighlightId(id)
    const t = setTimeout(
      () => setHighlightId(null),
      4000
    )

    return () => clearTimeout(t)
  }, [location.state])

  /* ===============================
     Forzar vista correcta según rol
  =============================== */

  useEffect(() => {
    setVista(isSucursalMain ? 'recibidos' : 'mios')
  }, [isSucursalMain])

  /* ===============================
     Reset página
  =============================== */

  useEffect(() => {
    setPage(1)
  }, [vista, sucursalFiltroId])

  /* ===============================
     Base pedidos
  =============================== */

  const pedidosBase = useMemo(() => {
    const base =
      vista === 'mios'
        ? pedidosMios
        : pedidosRecibidos

    if (
      vista === 'recibidos' &&
      sucursalFiltroId !== 'ALL'
    ) {
      return base.filter(
        p =>
          p.sucursalSolicitanteId ===
          sucursalFiltroId
      )
    }

    return base
  }, [
    vista,
    pedidosMios,
    pedidosRecibidos,
    sucursalFiltroId,
  ])

  /* ===============================
     Paginación
  =============================== */

  const totalPages = Math.max(
    1,
    Math.ceil(pedidosBase.length / PAGE_SIZE)
  )

  const pedidosPaginados = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return pedidosBase.slice(
      start,
      start + PAGE_SIZE
    )
  }, [pedidosBase, page])

  const loading =
    vista === 'mios'
      ? pedidosMiosLoading
      : pedidosRecibidosLoading

  const error =
    vista === 'mios'
      ? pedidosMiosError
      : pedidosRecibidosError

  /* ===============================
     Render
  =============================== */

  return (
    <div className="p-6 space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isSucursalMain
            ? 'Pedidos recibidos'
            : 'Mis pedidos'}
        </h1>

        {!isSucursalMain && (
          <Link
            to="/admin/pedidos/nuevo"
            className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
          >
            + Crear pedido
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {!isSucursalMain && (
          <TabButton
            active={vista === 'mios'}
            onClick={() => setVista('mios')}
          >
            Mis pedidos
          </TabButton>
        )}

        {isSucursalMain && (
          <TabButton
            active={vista === 'recibidos'}
            onClick={() =>
              setVista('recibidos')
            }
          >
            Pedidos recibidos
          </TabButton>
        )}
      </div>

      {/* Filtro sucursal (solo MAIN) */}
      {vista === 'recibidos' &&
        isSucursalMain && (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-400">
              Sucursal solicitante
            </span>

            <select
              value={sucursalFiltroId}
              onChange={e =>
                setSucursalFiltroId(
                  e.target.value
                )
              }
              className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1 text-sm"
            >
              <option value="ALL">
                Todas
              </option>

              {sucursales.map(s => (
                <option key={s._id} value={s._id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

      {/* Tabla */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        {loading && (
          <div className="p-6 text-sm text-slate-400">
            Cargando pedidos…
          </div>
        )}

        {error && (
          <div className="p-6 text-sm text-red-400">
            Error al cargar pedidos
          </div>
        )}

        {!loading && !error && (
          <>
            {pedidosPaginados.length === 0 ? (
              <EmptyState />
            ) : (
              <PedidosTable
                pedidos={pedidosPaginados}
                highlightId={highlightId}
                contextoRol={contextoRol}
                onVer={setPedidoDetalle}
                onPreparar={pedidoId =>
                  navigate(
                    `/admin/pedidos/${pedidoId}/preparar`
                  )
                }
                onDespachar={despacharPedido}
                onCancelar={cancelarPedido}
                cancelandoPedido={cancelandoPedido}
              />
            )}
          </>
        )}
      </div>

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() =>
              setPage(p => p - 1)
            }
            className="px-3 py-1 rounded bg-slate-800 disabled:opacity-40"
          >
            ←
          </button>

          <span className="text-slate-400">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() =>
              setPage(p => p + 1)
            }
            className="px-3 py-1 rounded bg-slate-800 disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}

      {/* Modal */}
      {pedidoDetalle && (
        <PedidoDetalleModal
          pedido={pedidoDetalle}
          onClose={() =>
            setPedidoDetalle(null)
          }
        />
      )}
    </div>
  )
}

/* =====================================================
   UI helpers
===================================================== */

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-lg text-sm ${active
        ? 'bg-slate-800 text-white'
        : 'text-slate-400 hover:bg-slate-800/60'
        }`}
    >
      {children}
    </button>
  )
}

function EmptyState() {
  return (
    <div className="p-8 text-center text-sm text-slate-400">
      No hay pedidos para mostrar
    </div>
  )
}