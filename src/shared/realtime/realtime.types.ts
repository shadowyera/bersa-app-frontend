/* ======================================================
   Tipos base SSE (shared frontend / backend)
====================================================== */

export type RealtimeEventType =
  /* ===============================
     Caja
  =============================== */
  | 'CAJA_ABIERTA'
  | 'CAJA_CERRADA'

  /* ===============================
     Productos
  =============================== */
  | 'PRODUCTO_CREATED'
  | 'PRODUCTO_UPDATED'
  | 'PRODUCTO_DELETED'

  /* ===============================
     Stock
  =============================== */
  | 'STOCK_ACTUALIZADO'

  /* ===============================
     Pedido Interno
  =============================== */
  | 'PEDIDO_CREATED'
  | 'PEDIDO_PREPARADO'
  | 'PEDIDO_DESPACHADO'

  /* ===============================
     Despacho Interno
  =============================== */
  | 'DESPACHO_CREATED'
  | 'DESPACHO_UPDATED'
  | 'DESPACHO_RECIBIDO'

  /* ===============================
     Guía de Despacho
  =============================== */
  | 'GUIA_DESPACHO_CREATED'

/**
 * Evento SSE genérico
 *
 * IMPORTANTE:
 * - Es un contrato compartido frontend / backend
 * - Los campos opcionales permiten reutilizar el mismo
 *   evento para distintos dominios
 */
export interface RealtimeEvent {
  type: RealtimeEventType

  /** Contexto de sucursal (para filtros futuros) */
  sucursalId: string

  /** Identidad del origen (para self-ignore) */
  origenUsuarioId?: string

  /* ===============================
     Caja
  =============================== */
  cajaId?: string
  aperturaCajaId?: string

  /* ===============================
     Productos / Stock
  =============================== */
  productoId?: string

  /* ===============================
     Pedido Interno
  =============================== */
  pedidoInternoId?: string

  /* ===============================
     Despacho Interno
  =============================== */
  despachoId?: string

  /* ===============================
     Guía de Despacho
  =============================== */
  guiaDespachoId?: string
}