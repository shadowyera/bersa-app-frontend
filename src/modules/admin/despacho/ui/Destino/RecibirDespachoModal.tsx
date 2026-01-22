import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import type {
  DespachoInterno,
} from '../../domain/despacho.types'

import {
  recibirDespacho,
} from '../../domain/despacho.api'

interface Props {
  despacho: DespachoInterno
  onClose: () => void
}

/**
 * =====================================================
 * RecibirDespachoModal
 *
 * Vista para sucursal DESTINO
 * Permite confirmar cantidades recibidas
 * =====================================================
 */
export function RecibirDespachoModal({
  despacho,
  onClose,
}: Props) {
  const [cantidades, setCantidades] = useState<
    Record<string, number>
  >(() =>
    Object.fromEntries(
      despacho.items.map(item => [
        item.productoId,
        item.cantidadDespachada,
      ])
    )
  )

  const mutation = useMutation({
    mutationFn: recibirDespacho,
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
      despachoId: despacho.id,
      items: despacho.items.map(item => ({
        productoId: item.productoId,
        cantidadRecibida:
          cantidades[item.productoId] ?? 0,
      })),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-md w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          Recibir despacho #{despacho.id.slice(-6)}
        </h2>

        <div className="space-y-3">
          {despacho.items.map(item => {
            const recibido =
              cantidades[item.productoId] ?? 0
            const hayDiferencia =
              recibido !== item.cantidadDespachada

            return (
              <div
                key={item.productoId}
                className="flex items-center justify-between gap-4"
              >
                <div className="text-sm">
                  <div className="font-medium">
                    {item.productoId}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Despachado:{' '}
                    {item.cantidadDespachada}{' '}
                    {item.unidadPedido}
                  </div>

                  {hayDiferencia && (
                    <div className="text-xs text-orange-600">
                      Diferencia detectada
                    </div>
                  )}
                </div>

                <input
                  type="number"
                  min={0}
                  className="w-24 border rounded px-2 py-1 text-sm"
                  value={recibido}
                  onChange={e =>
                    handleChange(
                      item.productoId,
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            )
          })}
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
              : 'Confirmar recepción'}
          </button>
        </div>
      </div>
    </div>
  )
}