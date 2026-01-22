import { useQuery } from '@tanstack/react-query'
import { getPedidosRecibidos } from '../domain/despacho.api'
import type { PedidoInterno } from '../domain/despacho.types'

export function usePedidosRecibidos() {
  return useQuery<PedidoInterno[]>({
    queryKey: ['pedidos-recibidos'],
    queryFn: getPedidosRecibidos,
    select: data =>
      (data ?? []).map(pedido => ({
        ...pedido,
        id: (pedido as any)._id, // 🔥 NORMALIZACIÓN
      })),
  })
}