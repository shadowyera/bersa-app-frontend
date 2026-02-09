import type { RealtimeEvent } from './realtime.types'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

type Handler = (event: RealtimeEvent) => void

const EVENT_TYPES: RealtimeEvent['type'][] = [
  'CAJA_ABIERTA',
  'CAJA_CERRADA',

  'PRODUCTO_CREATED',
  'PRODUCTO_UPDATED',
  'PRODUCTO_DELETED',

  'STOCK_ACTUALIZADO',

  'PEDIDO_CREATED',
  'PEDIDO_PREPARADO',
  'PEDIDO_DESPACHADO',

  'DESPACHO_CREATED',
  'DESPACHO_UPDATED',
  'DESPACHO_RECIBIDO',

  'GUIA_DESPACHO_CREATED',
]

class SSEClient {
  private source: EventSource | null = null
  private handlers = new Set<Handler>()
  private connected = false
  private reconnectTimer: number | null = null

  connect() {
    if (this.connected || this.source) return

    const source = new EventSource(
      `${API_BASE_URL}/api/realtime`,
      { withCredentials: true }
    )

    source.onopen = () => {
      this.connected = true
      this.source = source
    }

    EVENT_TYPES.forEach(type => {
      source.addEventListener(type, e => {
        try {
          const event = JSON.parse(
            (e as MessageEvent).data
          ) as RealtimeEvent

          this.handlers.forEach(handler => handler(event))
        } catch {
          // ignore
        }
      })
    })

    source.onerror = () => {
      this.scheduleReconnect()
    }
  }

  subscribe(handler: Handler) {
    this.connect() // 🔥 CLAVE
    this.handlers.add(handler)

    return () => {
      this.handlers.delete(handler)
    }
  }

  disconnect() {
    if (!this.source) return

    this.source.close()
    this.source = null
    this.connected = false
    this.handlers.clear()

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return

    this.disconnect()

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, 3000)
  }
}

export const sseClient = new SSEClient()