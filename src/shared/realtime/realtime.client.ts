import type {
  RealtimeEvent,
  RealtimeEventType,
} from '@/shared/realtime/realtime.types'

type EventHandler = (event: RealtimeEvent) => void

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

class RealtimeClient {
  private eventSource: EventSource | null = null
  private isConnecting = false

  private handlers = new Map<
    RealtimeEventType,
    Set<EventHandler>
  >()

  connect() {
    if (this.eventSource || this.isConnecting) return

    this.isConnecting = true

    this.eventSource = new EventSource(
      `${API_BASE_URL}/api/realtime`,
      { withCredentials: true }
    )

    this.eventSource.onopen = () => {
      this.isConnecting = false
      console.log('[SSE] conectado')
    }

    this.eventSource.onmessage = (event) => {
      try {
        const data: RealtimeEvent = JSON.parse(event.data)
        this.dispatch(data)
      } catch {
        // ignore
      }
    }

    this.eventSource.onerror = () => {
      console.warn('[SSE] desconectado, reintentando...')
      this.disconnect()

      setTimeout(() => this.connect(), 3000)
    }
  }

  private dispatch(event: RealtimeEvent) {
    const handlers = this.handlers.get(event.type)
    if (!handlers) return

    handlers.forEach(handler => {
      try {
        handler(event)
      } catch {
        // no-op
      }
    })
  }

  on(type: RealtimeEventType, handler: EventHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }

    const set = this.handlers.get(type)!
    set.add(handler)

    return () => {
      set.delete(handler)
      if (set.size === 0) {
        this.handlers.delete(type)
      }
    }
  }

  disconnect() {
    this.eventSource?.close()
    this.eventSource = null
    this.isConnecting = false
    this.handlers.clear()
  }
}

export const realtimeClient = new RealtimeClient()