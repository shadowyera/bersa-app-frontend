import { api } from "@/shared/api/api"
import type { PedidoInterno } from "../types/pedido.types"

/* =====================================================
   API – Pedidos Internos
   -----------------------------------------------------
   Capa de comunicación con backend.
   NO contiene lógica de negocio.
===================================================== */

/* =====================================================
   Crear pedido interno
   -----------------------------------------------------
   POST /api/pedidos-internos
   - Sucursal solicitante crea pedido
===================================================== */
export async function crearPedidoInterno(input: {
  sucursalAbastecedoraId: string
  items: {
    productoId: string
    cantidadSolicitada: number
  }[]
}) {
  const { data } = await api.post<PedidoInterno>(
    '/pedidos-internos',
    input
  )

  return data
}

/* =====================================================
   Editar pedido interno
   -----------------------------------------------------
   PUT /api/pedidos-internos/:id
   - Solo permitido en estado CREADO
===================================================== */
export async function editarPedidoInterno(
  pedidoId: string,
  items: {
    productoId: string
    cantidadSolicitada: number
  }[]
) {
  const { data } = await api.put<PedidoInterno>(
    `/pedidos-internos/${pedidoId}`,
    { items }
  )

  return data
}

/* =====================================================
   Cancelar pedido interno
   -----------------------------------------------------
   POST /api/pedidos-internos/:id/cancelar
===================================================== */
export async function cancelarPedidoInterno(
  pedidoId: string
) {
  const { data } = await api.post<PedidoInterno>(
    `/pedidos-internos/${pedidoId}/cancelar`
  )

  return data
}

/* =====================================================
   Listar pedidos creados por mi sucursal
   -----------------------------------------------------
   GET /api/pedidos-internos/mios
===================================================== */
export async function getPedidosInternosMios() {
  const { data } = await api.get<PedidoInterno[]>(
    '/pedidos-internos/mios'
  )

  return data
}

/* =====================================================
   Listar pedidos que debo abastecer (bodega)
   -----------------------------------------------------
   GET /api/pedidos-internos/recibidos
===================================================== */
export async function getPedidosInternosRecibidos() {
  const { data } = await api.get<PedidoInterno[]>(
    '/pedidos-internos/recibidos'
  )

  return data
}

/* =====================================================
   Preparar pedido interno
   -----------------------------------------------------
   POST /api/pedidos-internos/:id/preparar
   - Bodega define cantidades preparadas
===================================================== */
export async function prepararPedidoInterno(
  pedidoId: string,
  items: {
    productoId: string
    cantidadPreparada: number
  }[]
) {
  const { data } = await api.post<PedidoInterno>(
    `/pedidos-internos/${pedidoId}/preparar`,
    { items }
  )

  return data
}

/* =====================================================
   Despachar pedido interno
   -----------------------------------------------------
   POST /api/pedidos-internos/:id/despachar
   - Bodega marca pedido como DESPACHADO
===================================================== */
export async function despacharPedidoInterno(
  pedidoId: string
) {
  const { data } = await api.post<PedidoInterno>(
    `/pedidos-internos/${pedidoId}/despachar`
  )

  return data
}