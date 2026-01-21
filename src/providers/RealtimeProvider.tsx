import { useEffect } from 'react'
import { realtimeClient } from '@/shared/realtime/realtime.client'

/**
 * =====================================================
 * RealtimeProvider
 *
 * Infraestructura global de la app
 * - Maneja UNA conexión SSE
 * - No renderiza UI
 * =====================================================
 */
export function RealtimeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    realtimeClient.connect()

    return () => {
      realtimeClient.disconnect()
    }
  }, [])

  return <>{children}</>
}