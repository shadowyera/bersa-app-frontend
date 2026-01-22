import { useState } from 'react'

import { useDespachos } from '../../hooks/useDespachos'
import type { DespachoInterno } from '../../domain/despacho.types'

import { DespachoEstadoBadge } from '../Shared/DespachoEstadoBadge'
import { RecibirDespachoModal } from './RecibirDespachoModal'

/**
 * =====================================================
 * DespachosDestinoPage
 *
 * Vista para sucursales NO principales
 *
 * Responsabilidades:
 * - Ver despachos entrantes
 * - Recibir despacho
 * =====================================================
 */
export function DespachosDestinoPage() {
  const { data: despachos, isLoading, isError } =
    useDespachos()

  const [despachoSeleccionado, setDespachoSeleccionado] =
    useState<DespachoInterno | null>(null)

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Cargando despachos…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        Error al cargar despachos
      </div>
    )
  }

  if (!despachos || despachos.length === 0) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        No hay despachos entrantes
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Despachos Entrantes
      </h1>

      <div className="border rounded-md divide-y">
        {despachos.map(despacho => (
          <div
            key={despacho.id}
            className="flex items-center justify-between p-4"
          >
            <div className="space-y-1">
              <div className="text-sm font-medium">
                Despacho #{despacho.id.slice(-6)}
              </div>

              <DespachoEstadoBadge
                estado={despacho.estado}
              />
            </div>

            <div className="flex items-center gap-2">
              {despacho.estado === 'DESPACHADO' && (
                <button
                  className="text-sm text-primary underline"
                  onClick={() =>
                    setDespachoSeleccionado(despacho)
                  }
                >
                  Recibir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de recepción */}
      {despachoSeleccionado && (
        <RecibirDespachoModal
          despacho={despachoSeleccionado}
          onClose={() =>
            setDespachoSeleccionado(null)
          }
        />
      )}
    </div>
  )
}