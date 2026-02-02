import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'
import type { ReactNode } from 'react'

/* ===================== API ===================== */
import {
  getPedidosInternosMios,
  getPedidosInternosRecibidos,
} from '../domain/api/pedido.api'

/* ===================== Domain ===================== */
import type { PedidoInterno } from '../domain/types/pedido.types'

/* ===================== Realtime ===================== */
import { sseClient } from '@/shared/realtime/sse.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'

/* ===================== Auth ===================== */
import { useAuth } from '@/modules/auth/useAuth'

/* =====================================================
   Context
===================================================== */
interface PedidosContextValue {
  pedidosMios: PedidoInterno[]
  pedidosRecibidos: PedidoInterno[]

  cargando: boolean
  error?: string

  reload: () => Promise<void>
}

const PedidosContext =
  createContext<PedidosContextValue | null>(null)

/* =====================================================
   Provider
===================================================== */
export function PedidosProvider({
  children,
}: {
  children: ReactNode
}) {
  const { user } = useAuth()

  const [pedidosMios, setPedidosMios] = useState<
    PedidoInterno[]
  >([])
  const [pedidosRecibidos, setPedidosRecibidos] =
    useState<PedidoInterno[]>([])

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | undefined>(
    undefined
  )

  /* =====================================================
     Carga inicial REST
  ===================================================== */
  const loadPedidos = useCallback(async () => {
    if (!user) return

    setCargando(true)
    setError(undefined)

    try {
      const [mios, recibidos] = await Promise.all([
        getPedidosInternosMios(),
        getPedidosInternosRecibidos(),
      ])

      setPedidosMios(mios)
      setPedidosRecibidos(recibidos)
    } catch {
      setError('No se pudieron cargar los pedidos')
    } finally {
      setCargando(false)
    }
  }, [user])

  useEffect(() => {
    loadPedidos()
  }, [loadPedidos])

  /* =====================================================
     SSE – Pedidos Internos
     - escucha eventos
     - actualiza estado local
  ===================================================== */
  useEffect(() => {
    if (!user) return

    const PEDIDO_EVENTS: RealtimeEvent['type'][] = [
      'PEDIDO_CREATED',
      'PEDIDO_PREPARADO',
      'PEDIDO_DESPACHADO',
    ]

    const handler = (event: RealtimeEvent) => {
      if (!PEDIDO_EVENTS.includes(event.type)) return
      if (!event.pedidoId) return

      /* ================= PEDIDO CREATED ================= */
      if (event.type === 'PEDIDO_CREATED') {
        // Mis pedidos
        if (event.sucursalId === user.sucursalId) {
          setPedidosMios(prev => [
            {
              id: event.pedidoId,
              estado: 'CREADO',
            } as PedidoInterno,
            ...prev,
          ])
        }

        // Pedidos recibidos
        if (event.sucursalId === user.sucursalId) {
          setPedidosRecibidos(prev => [
            {
              id: event.pedidoId,
              estado: 'CREADO',
            } as PedidoInterno,
            ...prev,
          ])
        }
      }

      /* ================= PEDIDO PREPARADO ================= */
      if (event.type === 'PEDIDO_PREPARADO') {
        setPedidosMios(prev =>
          prev.map(p =>
            p.id === event.pedidoId
              ? { ...p, estado: 'PREPARADO' }
              : p
          )
        )

        setPedidosRecibidos(prev =>
          prev.map(p =>
            p.id === event.pedidoId
              ? { ...p, estado: 'PREPARADO' }
              : p
          )
        )
      }

      /* ================= PEDIDO DESPACHADO ================= */
      if (event.type === 'PEDIDO_DESPACHADO') {
        setPedidosMios(prev =>
          prev.map(p =>
            p.id === event.pedidoId
              ? { ...p, estado: 'DESPACHADO' }
              : p
          )
        )

        setPedidosRecibidos(prev =>
          prev.map(p =>
            p.id === event.pedidoId
              ? { ...p, estado: 'DESPACHADO' }
              : p
          )
        )
      }
    }

    const unsubscribe = sseClient.subscribe(handler)

    return () => {
      unsubscribe()
    }
  }, [user])

  /* =====================================================
     Context value
  ===================================================== */
  const value = useMemo(
    () => ({
      pedidosMios,
      pedidosRecibidos,
      cargando,
      error,
      reload: loadPedidos,
    }),
    [
      pedidosMios,
      pedidosRecibidos,
      cargando,
      error,
      loadPedidos,
    ]
  )

  return (
    <PedidosContext.Provider value={value}>
      {children}
    </PedidosContext.Provider>
  )
}

/* =====================================================
   Hook
===================================================== */
export function usePedidos() {
  const ctx = useContext(PedidosContext)
  if (!ctx) {
    throw new Error(
      'usePedidos debe usarse dentro de <PedidosProvider>'
    )
  }
  return ctx
}