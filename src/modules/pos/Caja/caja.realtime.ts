import type { RealtimeEvent } from '@/shared/realtime/realtime.events'

/**
 * Conexión SSE para eventos de caja.
 *
 * - Mantiene una única conexión global
 * - Permite registrar múltiples handlers
 * - Distribuye eventos parseados a los handlers
 */

/* ===============================
   Estado interno
=============================== */

let eventSource: EventSource | null = null

const handlers = new Set<
  (event: RealtimeEvent) => void
>()

/* ===============================
   Conexión SSE
=============================== */

export function connectCajaRealtime() {
  // Evita múltiples conexiones
  if (eventSource) return

  eventSource = new EventSource(
    '/api/realtime/cajas',
    { withCredentials: true }
  )

  eventSource.onmessage = e => {
    try {
      const event: RealtimeEvent =
        JSON.parse(e.data)

      handlers.forEach(handler => {
        handler(event)
      })
    } catch (err) {
      console.error(
        '[CAJA SSE] Error parseando evento',
        err
      )
    }
  }

  eventSource.onerror = err => {
    console.error(
      '[CAJA SSE] Error de conexión',
      err
    )
  }

  console.log('[CAJA SSE] Conectado')
}

/* ===============================
   Registro de handlers
=============================== */

/**
 * Registra un handler para eventos de caja.
 *
 * Retorna una función de cleanup para desregistrar.
 */
export function registerCajaRealtimeHandler(
  handler: (event: RealtimeEvent) => void
) {
  handlers.add(handler)

  return () => {
    handlers.delete(handler)
  }
}