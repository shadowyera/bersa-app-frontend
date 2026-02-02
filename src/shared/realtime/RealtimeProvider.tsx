import { useEffect } from 'react'
import { sseClient } from '@/shared/realtime/sse.client'
import { useAuth } from '@/modules/auth/useAuth'

export function RealtimeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    sseClient.connect()

    return () => {
      sseClient.disconnect()
    }
  }, [user])

  return <>{children}</>
}