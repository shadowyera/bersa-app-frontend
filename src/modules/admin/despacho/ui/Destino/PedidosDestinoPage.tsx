import { useState } from 'react'

import { usePedidosPropios } from '../../hooks/usePedidosPropios'
import { CrearPedidoModal } from '../Shared/CrearPedidoModal'

export function PedidosDestinoPage() {
  const { data: pedidos = [], isLoading } =
    usePedidosPropios()

  const [openCrearPedido, setOpenCrearPedido] =
    useState(false)

  if (isLoading) {
    return <div>Cargando pedidos…</div>
  }

  return (
    <div className="space-y-4">
      {/* ===============================
          Header
      =============================== */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          Mis pedidos internos
        </h1>

        <button
          onClick={() => setOpenCrearPedido(true)}
          className="
            rounded-md bg-emerald-600
            px-3 py-1 text-sm text-white
          "
        >
          + Crear pedido
        </button>
      </div>

      {/* ===============================
          Lista de pedidos
      =============================== */}
      {pedidos.length === 0 ? (
        <div className="text-sm text-slate-400">
          No hay pedidos creados
        </div>
      ) : (
        <div className="space-y-2">
          {pedidos.map(pedido => (
            <div
              key={pedido.id}
              className="
                rounded-lg border border-slate-800
                p-3 text-sm
              "
            >
              Pedido #{pedido.id.slice(-6)} ·{' '}
              {pedido.estado}
            </div>
          ))}
        </div>
      )}

      {/* ===============================
          Modal
      =============================== */}
      {openCrearPedido && (
        <CrearPedidoModal
          onClose={() =>
            setOpenCrearPedido(false)
          }
        />
      )}
    </div>
  )
}