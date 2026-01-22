import { useQuery } from '@tanstack/react-query'
import { getPedidosPropios } from '../domain/despacho.api'
import type { PedidoInterno } from '../domain/despacho.types'

export function usePedidosPropios() {
  return useQuery<PedidoInterno[]>({
    queryKey: ['pedidos-propios'],
    queryFn: getPedidosPropios,
    select: data =>
      (data ?? []).map(pedido => ({
        ...pedido,
        id: (pedido as any)._id, // 🔥 normalización clave
      })),
  })
}