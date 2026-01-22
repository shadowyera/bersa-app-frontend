import { useState } from 'react'

import { useDespachos } from '../../hooks/useDespachos'
import { usePedidosRecibidos } from '../../hooks/usePedidosRecibidos'
import {
  type DespachoInterno,
  type PedidoInterno,
} from '../../domain/despacho.types'

import { DespachoEstadoBadge } from '../Shared/DespachoEstadoBadge'
import { PrepararPedidoModal } from './PrepararPedidoModal'
import { DespachoDetalleModal } from '../Shared/DespachoDetalleModal'

/**
 * =====================================================
 * DespachosOrigenPage
 *
 * Vista para sucursal PRINCIPAL (bodega)
 *
 * Responsabilidades:
 * - Ver pedidos recibidos
 * - Preparar pedidos
 * - Ver despachos salientes
 * =====================================================
 */
export function DespachosOrigenPage() {
  const {
    data: despachos,
    isLoading: loadingDespachos,
    isError: errorDespachos,
  } = useDespachos()

  const {
    data: pedidos,
    isLoading: loadingPedidos,
    isError: errorPedidos,
  } = usePedidosRecibidos()

  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState<PedidoInterno | null>(null)

  const [despachoSeleccionado, setDespachoSeleccionado] =
    useState<DespachoInterno | null>(null)

  if (loadingDespachos || loadingPedidos) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Cargando despacho…
      </div>
    )
  }

  if (errorDespachos || errorPedidos) {
    return (
      <div className="p-6 text-sm text-destructive">
        Error al cargar información de despacho
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-xl font-semibold">
        Bodega / Despachos
      </h1>

      {/* ===============================
          PEDIDOS RECIBIDOS
      =============================== */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Pedidos recibidos
        </h2>

        {!pedidos || pedidos.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No hay pedidos pendientes
          </div>
        ) : (
          <div className="border rounded-md divide-y">
            {pedidos.map(pedido => (
              <div
                key={pedido.id}
                className="flex items-center justify-between p-4"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    Pedido #{pedido.id.slice(-6)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Estado: {pedido.estado}
                  </div>
                </div>

                {pedido.estado === 'CREADO' && (
                  <button
                    className="text-sm text-primary underline"
                    onClick={() =>
                      setPedidoSeleccionado(pedido)
                    }
                  >
                    Preparar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===============================
          DESPACHOS SALIENTES
      =============================== */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Despachos salientes
        </h2>

        {!despachos || despachos.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No hay despachos
          </div>
        ) : (
          <div className="border rounded-md divide-y">
            {despachos.map(despacho => (
              <div
                key={despacho.id}
                className="flex items-center justify-between p-4"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    Despacho #{despacho.id.slice(-6)}
                  </div>
                  <DespachoEstadoBadge
                    estado={despacho.estado}
                  />
                </div>

                <button
                  className="text-sm text-primary underline"
                  onClick={() =>
                    setDespachoSeleccionado(despacho)
                  }
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===============================
          MODALES
      =============================== */}
      {pedidoSeleccionado && (
        <PrepararPedidoModal
          pedido={pedidoSeleccionado}
          onClose={() =>
            setPedidoSeleccionado(null)
          }
        />
      )}

      {despachoSeleccionado && (
        <DespachoDetalleModal
          despacho={despachoSeleccionado}
          onClose={() =>
            setDespachoSeleccionado(null)
          }
        />
      )}
    </div>
  )
}