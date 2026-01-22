import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import type {
  PedidoInterno,
} from '../../domain/despacho.types'

import {
  prepararPedidoInterno,
} from '../../domain/despacho.api'

interface Props {
  pedido: PedidoInterno
  onClose: () => void
}

/**
 * =====================================================
 * PrepararPedidoModal
 *
 * Bodega / sucursal principal
 * Permite indicar cuánto se prepara de cada item
 * =====================================================
 */
export function PrepararPedidoModal({
  pedido,
  onClose,
}: Props) {
  const [cantidades, setCantidades] = useState<
    Record<string, number>
  >(() =>
    Object.fromEntries(
      pedido.items.map(item => [
        item.productoId,
        item.cantidadSolicitada,
      ])
    )
  )

  const mutation = useMutation({
    mutationFn: prepararPedidoInterno,
    onSuccess: () => {
      onClose()
    },
  })

  const handleChange = (
    productoId: string,
    value: number
  ) => {
    setCantidades(prev => ({
      ...prev,
      [productoId]: value,
    }))
  }

  const handleSubmit = () => {
    mutation.mutate({
      pedidoId: pedido.id,
      items: pedido.items.map(item => ({
        productoId: item.productoId,
        cantidadPreparada:
          cantidades[item.productoId] ?? 0,
      })),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gray rounded-md w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          Preparar pedido #{pedido.id.slice(-6)}
        </h2>

        <div className="space-y-3">
          {pedido.items.map(item => (
            <div
              key={item.productoId}
              className="flex items-center justify-between gap-4"
            >
              <div className="text-sm">
                <div className="font-medium">
                  {item.productoId}
                </div>
                <div className="text-xs text-muted-foreground">
                  Solicitado: {item.cantidadSolicitada}{' '}
                  {item.unidadPedido}
                </div>
              </div>

              <input
                type="number"
                min={0}
                max={item.cantidadSolicitada}
                className="w-24 border rounded px-2 py-1 text-sm"
                value={
                  cantidades[item.productoId] ?? 0
                }
                onChange={e =>
                  handleChange(
                    item.productoId,
                    Number(e.target.value)
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            className="text-sm px-3 py-1 border rounded"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancelar
          </button>

          <button
            className="text-sm px-3 py-1 bg-primary text-white rounded"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? 'Guardando…'
              : 'Preparar'}
          </button>
        </div>
      </div>
    </div>
  )
}