/* ======================================================
   Tipos base SSE (shared frontend / backend)
====================================================== */

export type RealtimeEventType =
   | 'CAJA_ABIERTA'
   | 'CAJA_CERRADA'

   | 'PRODUCTO_CREATED'
   | 'PRODUCTO_UPDATED'
   | 'PRODUCTO_DELETED'

   | 'STOCK_ACTUALIZADO'

   | 'PEDIDO_CREATED'
   | 'PEDIDO_PREPARADO'
   | 'PEDIDO_DESPACHADO'

   | 'DESPACHO_CREATED'
   | 'DESPACHO_UPDATED'
   | 'DESPACHO_RECIBIDO'

   | 'GUIA_DESPACHO_CREATED'

/**
 * Evento SSE genérico
 * Contrato único frontend ↔ backend
 */
export interface RealtimeEvent {
   /* ===============================
      Core
   =============================== */
   type: RealtimeEventType

   /** Contexto del evento */
   sucursalId: string | 'GLOBAL'

   /** Usuario que originó el evento */
   origenUsuarioId?: string
   origenUsuarioNombre?: string

   /* ===============================
      Caja
   =============================== */
   cajaId?: string
   aperturaCajaId?: string
   aperturaId?: string
   /* ===============================
      Productos / Stock
   =============================== */
   productoId?: string

   /* ===============================
      Pedido Interno
   =============================== */
   pedidoId?: string

   /* ===============================
      Despacho Interno
   =============================== */
   despachoId?: string

   /* ===============================
      Guía de Despacho
   =============================== */
   guiaDespachoId?: string
}