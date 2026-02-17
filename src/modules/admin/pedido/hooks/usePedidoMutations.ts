import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  crearPedidoInterno,
  editarPedidoInterno,
  cancelarPedidoInterno,
  prepararPedidoInterno,
  despacharPedidoInterno,
} from '../domain/api/pedido.api'

/* =====================================================
   Hook: usePedidoMutations
   -----------------------------------------------------
   Centraliza todas las mutaciones del módulo Pedidos.
   Se encarga de:
   - ejecutar la acción
   - invalidar cache correspondiente
   NO contiene lógica de negocio.
===================================================== */

export function usePedidoMutations() {
  const queryClient = useQueryClient()

  /* ===================================================
     Crear pedido interno
  =================================================== */
  const crearPedidoMutation = useMutation({
    mutationFn: crearPedidoInterno,
    onSuccess: () => {
      /**
       * Al crear un pedido:
       * - aparece en pedidos propios
       * - aparece en pedidos recibidos (bodega)
       */
      queryClient.invalidateQueries({
        queryKey: ['pedidos-internos', 'mios'],
      })
      queryClient.invalidateQueries({
        queryKey: ['pedidos-internos', 'recibidos'],
      })
    },
  })

  /* ===================================================
     Editar pedido interno
  =================================================== */
  const editarPedidoMutation = useMutation({
    mutationFn: ({
      pedidoId,
      items,
    }: {
      pedidoId: string
      items: {
        productoId: string
        cantidadSolicitada: number
      }[]
    }) =>
      editarPedidoInterno(pedidoId, items),
    onSuccess: () => {
      /**
       * Editar solo afecta pedidos propios
       */
      queryClient.invalidateQueries({
        queryKey: ['pedidos-internos', 'mios'],
      })
    },
  })

  /* ===================================================
     Cancelar pedido interno
  =================================================== */
  const cancelarPedidoMutation = useMutation({
    mutationFn: cancelarPedidoInterno,
    onSuccess: () => {
      /**
       * Cancelar afecta:
       * - pedidos propios
       * - pedidos recibidos (si ya fue visible)
       */
      queryClient.invalidateQueries({
        queryKey: ['pedidos-internos', 'mios'],
      })
      queryClient.invalidateQueries({
        queryKey: ['pedidos-internos', 'recibidos'],
      })
    },
  })

  /* ===================================================
     Preparar pedido interno (bodega)
  =================================================== */
  const prepararPedidoMutation = useMutation({
    mutationFn: ({
      pedidoId,
      items,
    }: {
      pedidoId: string
      items: {
        productoId: string
        cantidadPreparada: number
      }[]
    }) =>
      prepararPedidoInterno(pedidoId, items),
    onSuccess: () => {
      /**
       * Preparar afecta:
       * - pedidos recibidos
       * - pedidos propios (estado actualizado)
       */
      queryClient.invalidateQueries({
        queryKey: ['pedidos-internos', 'recibidos'],
      })
      queryClient.invalidateQueries({
        queryKey: ['pedidos-internos', 'mios'],
      })
    },
  })

  /* ===================================================
     Despachar pedido interno (bodega)
  =================================================== */
  const despacharPedidoMutation = useMutation({
    mutationFn: (pedidoId: string) =>
      despacharPedidoInterno(pedidoId),
    onSuccess: () => {
      /**
       * Despachar afecta:
       * - pedidos recibidos
       * - pedidos propios (estado actualizado)
       */
      queryClient.invalidateQueries({
        queryKey: ['pedidos-internos', 'recibidos'],
      })
      queryClient.invalidateQueries({
        queryKey: ['pedidos-internos', 'mios'],
      })
    },
  })

  /* ===================================================
     API pública del hook
  =================================================== */
  return {
    /* Crear */
    crearPedido: crearPedidoMutation.mutateAsync,
    creandoPedido: crearPedidoMutation.isPending,
    crearPedidoError: crearPedidoMutation.error,

    /* Editar */
    editarPedido: editarPedidoMutation.mutateAsync,
    editandoPedido: editarPedidoMutation.isPending,
    editarPedidoError: editarPedidoMutation.error,

    /* Cancelar */
    cancelarPedido:
      cancelarPedidoMutation.mutateAsync,
    cancelandoPedido:
      cancelarPedidoMutation.isPending,
    cancelarPedidoError:
      cancelarPedidoMutation.error,

    /* Preparar */
    prepararPedido:
      prepararPedidoMutation.mutateAsync,
    preparandoPedido:
      prepararPedidoMutation.isPending,
    prepararPedidoError:
      prepararPedidoMutation.error,

    /* Despachar */
    despacharPedido:
      despacharPedidoMutation.mutateAsync,
    despachandoPedido:
      despacharPedidoMutation.isPending,
    despacharPedidoError:
      despacharPedidoMutation.error,
  }
}