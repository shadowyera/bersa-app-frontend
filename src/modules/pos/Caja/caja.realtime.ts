import type { RealtimeEvent } from "@/shared/realtime/realtime.events"

/* =====================================================
   Estado interno del SSE
===================================================== */

let eventSource: EventSource | null = null

const handlers = new Set<
  (event: RealtimeEvent) => void
>()

/* =====================================================
   Conectar SSE (una sola vez)
===================================================== */
export function connectCajaRealtime() {
  if (eventSource) return

  eventSource = new EventSource('/api/realtime/cajas', {
    withCredentials: true,
  })

  eventSource.onmessage = (e) => {
    try {
      const data: RealtimeEvent =
        JSON.parse(e.data)

      handlers.forEach((handler) => {
        handler(data)
      })
    } catch (err) {
      console.error('[CAJA SSE] error parseando', err)
    }
  }

  eventSource.onerror = (err) => {
    console.error('[CAJA SSE] error', err)
  }

  console.log('[CAJA SSE] conectado')
}

/* =====================================================
   Registrar handler
===================================================== */
export function registerCajaRealtimeHandler(
  handler: (event: RealtimeEvent) => void
) {
  handlers.add(handler)

  // cleanup automático
  return () => {
    handlers.delete(handler)
  }
}