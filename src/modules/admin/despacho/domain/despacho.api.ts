import { api } from "@/shared/api/api"

import type {
  PedidoInterno,
  DespachoInterno,
  GuiaDespacho,
  CrearPedidoInternoDTO,
  PrepararPedidoInternoDTO,
  CrearDespachoManualDTO,
  RecibirDespachoDTO,
} from './despacho.types'

/* =====================================================
   PEDIDOS INTERNOS
===================================================== */

/**
 * Crear pedido interno
 * (Sucursal destino → solicita a bodega principal)
 */
export async function crearPedidoInterno(
  payload: CrearPedidoInternoDTO
): Promise<PedidoInterno> {
  const { data } = await api.post(
    '/pedidos-internos',
    payload
  )
  return data
}

/**
 * Pedidos creados por mi sucursal
 */
export async function getPedidosPropios(): Promise<
  PedidoInterno[]
> {
  const { data } = await api.get(
    '/pedidos-internos/mios'
  )
  return data
}

/**
 * Pedidos que debo abastecer
 * (solo bodega principal)
 */
export async function getPedidosRecibidos(): Promise<
  PedidoInterno[]
> {
  const { data } = await api.get(
    '/pedidos-internos/recibidos'
  )
  return data
}

/**
 * Preparar pedido interno
 * (bodega principal)
 */
export async function prepararPedidoInterno(
  payload: PrepararPedidoInternoDTO
): Promise<PedidoInterno> {
  const { pedidoId, items } = payload

  const { data } = await api.post(
    `/pedidos-internos/${pedidoId}/preparar`,
    { items }
  )

  return data
}

/* =====================================================
   DESPACHOS INTERNOS
===================================================== */

/**
 * Listar despachos según contexto:
 * - Origen (bodega principal)
 * - Destino (sucursal)
 *
 * El hook decide cuál usar.
 */
export async function getDespachosOrigen(): Promise<
  DespachoInterno[]
> {
  const { data } = await api.get(
    '/despachos-internos'
  )
  return data
}

export async function getDespachosDestino(): Promise<
  DespachoInterno[]
> {
  const { data } = await api.get(
    '/despachos-internos'
  )
  return data
}

/**
 * Obtener despacho por id (detalle)
 */
export async function getDespachoById(
  despachoId: string
): Promise<DespachoInterno> {
  const { data } = await api.get(
    `/despachos-internos/${despachoId}`
  )
  return data
}

/**
 * Despachar pedido interno preparado
 */
export async function despacharPedidoInterno(
  pedidoId: string
): Promise<DespachoInterno> {
  const { data } = await api.post(
    `/despachos-internos/${pedidoId}`
  )
  return data
}

/**
 * Crear despacho manual / urgente
 */
export async function crearDespachoManual(
  payload: CrearDespachoManualDTO
): Promise<DespachoInterno> {
  const { data } = await api.post(
    '/despachos-internos/manual',
    payload
  )
  return data
}

/**
 * Recepción de despacho (sucursal destino)
 */
export async function recibirDespacho(
  payload: RecibirDespachoDTO
): Promise<DespachoInterno> {
  const { despachoId, items, observacion } = payload

  const { data } = await api.post(
    `/despachos-internos/${despachoId}/recibir`,
    { items, observacion }
  )

  return data
}

/* =====================================================
   GUÍA DE DESPACHO
===================================================== */

/**
 * Crear (o recuperar) guía de despacho
 */
export async function crearGuiaDespacho(
  despachoId: string,
  observacion?: string
): Promise<GuiaDespacho> {
  const { data } = await api.post(
    `/guias-despacho/despacho/${despachoId}`,
    { observacion }
  )
  return data
}

/**
 * Obtener URL del PDF de la guía
 * (el front solo abre la URL)
 */
export function getGuiaDespachoPdfUrl(
  guiaId: string
): string {
  return `/guias-despacho/${guiaId}/pdf`
}