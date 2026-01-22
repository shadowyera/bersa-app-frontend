/* =====================================================
   Estados – Pedido Interno
===================================================== */

export const ESTADO_PEDIDO_INTERNO = {
  CREADO: 'CREADO',
  PREPARADO: 'PREPARADO',
  DESPACHADO: 'DESPACHADO',
} as const

export type EstadoPedidoInterno =
  (typeof ESTADO_PEDIDO_INTERNO)[keyof typeof ESTADO_PEDIDO_INTERNO]

/* =====================================================
   Pedido Interno – Item
===================================================== */

export interface PedidoInternoItem {
  productoId: string

  cantidadSolicitada: number
  unidadPedido: string
  factorUnidad: number
  cantidadBaseSolicitada: number

  cantidadPreparada?: number
}

/* =====================================================
   Pedido Interno
===================================================== */

export interface PedidoInterno {
  id: string

  sucursalSolicitanteId: string
  sucursalAbastecedoraId: string

  estado: EstadoPedidoInterno

  items: PedidoInternoItem[]

  createdAt: string
  updatedAt: string
}

/* =====================================================
   Estados – Despacho Interno
===================================================== */

export const ESTADO_DESPACHO_INTERNO = {
  DESPACHADO: 'DESPACHADO',
  RECIBIDO: 'RECIBIDO',
  OBSERVADO: 'OBSERVADO',
} as const

export type EstadoDespachoInterno =
  (typeof ESTADO_DESPACHO_INTERNO)[keyof typeof ESTADO_DESPACHO_INTERNO]

/* =====================================================
   Despacho Interno – Item
===================================================== */

export interface DespachoInternoItem {
  productoId: string

  cantidadDespachada: number
  unidadPedido: string
  factorUnidad: number
  cantidadBaseDespachada: number
}

/* =====================================================
   Despacho Interno
===================================================== */

export interface DespachoInterno {
  id: string

  /** Pedido que originó el despacho (opcional) */
  pedidoInternoId?: string | null

  sucursalOrigenId: string
  sucursalDestinoId: string

  estado: EstadoDespachoInterno

  items: DespachoInternoItem[]

  createdAt: string
  updatedAt: string
}

/* =====================================================
   Guía de Despacho
===================================================== */

export interface GuiaDespachoItem {
  productoId: string
  nombreProducto: string
  cantidad: number
  unidad: string
}

export interface GuiaDespacho {
  id: string

  numero: number

  despachoInternoId: string

  sucursalOrigenId: string
  nombreOrigen: string
  direccionOrigen: string

  sucursalDestinoId: string
  nombreDestino: string
  direccionDestino: string

  items: GuiaDespachoItem[]

  observacion?: string

  createdAt: string
}

/* =====================================================
   DTOs / Payloads Frontend
===================================================== */

/**
 * Crear pedido interno (desde sucursal destino)
 */
export interface CrearPedidoInternoDTO {
  sucursalAbastecedoraId: string
  items: {
    productoId: string
    cantidadSolicitada: number
  }[]
}

/**
 * Preparar pedido interno (desde bodega principal)
 */
export interface PrepararPedidoInternoDTO {
  pedidoId: string
  items: {
    productoId: string
    cantidadPreparada: number
  }[]
}

/**
 * Crear despacho manual / urgente
 */
export interface CrearDespachoManualDTO {
  sucursalDestinoId: string
  items: {
    productoId: string
    cantidad: number
    unidadPedido: string
    factorUnidad: number
  }[]
  observacion?: string
}

/**
 * Recepción de despacho
 */
export interface RecibirDespachoDTO {
  despachoId: string
  items: {
    productoId: string
    cantidadRecibida: number
  }[]
  observacion?: string
}