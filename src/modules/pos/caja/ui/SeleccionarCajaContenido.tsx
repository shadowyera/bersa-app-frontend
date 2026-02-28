import { memo } from 'react'
import { useSeleccionarCaja } from '../hooks/useSeleccionarCaja'


import { Badge } from '@/shared/ui/badge/badge'
import { Separator } from '@/shared/ui/separator/separator'
import { Skeleton } from '@/shared/ui/skeleton/skeleton'
import { CardInteractive, Card } from '../../../../shared/ui/card/Card';

function SeleccionarCajaContenido() {
  const {
    cajas,
    loading,
    error,
    validandoCaja,
    onSelectCaja,
  } = useSeleccionarCaja()

  return (
    <div className="w-full max-w-md">
      <Card className="overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5">
          <h2 className="text-lg font-semibold text-foreground">
            Seleccionar caja
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Elige una caja para comenzar a operar
          </p>
        </div>

        <Separator />

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && cajas.length === 0 && (
            <p className="text-sm text-foreground/60">
              No hay cajas disponibles
            </p>
          )}

          {!loading && !error && (
            <ul className="space-y-3">
              {cajas.map(caja => {
                const isAbierta = caja.abierta

                return (
                  <li key={caja.id}>
                    <CardInteractive
                      onClick={() => onSelectCaja(caja)}
                      disabled={validandoCaja}
                      className={`
            w-full
            p-5
            flex items-center justify-between
            gap-4
            min-h-[92px]
            transition-all duration-200
            ${isAbierta
                          ? 'ring-1 ring-primary/40 bg-primary/5'
                          : ''
                        }
          `}
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-base font-semibold text-foreground">
                          {caja.nombre}
                        </span>

                        {isAbierta && caja.abiertaPor && (
                          <span className="text-sm text-foreground/60 mt-1">
                            Abierta por{' '}
                            <span className="font-medium text-foreground">
                              {caja.abiertaPor}
                            </span>
                          </span>
                        )}
                      </div>

                      <Badge variant={isAbierta ? 'success' : 'muted'}>
                        {isAbierta ? 'ABIERTA' : 'CERRADA'}
                      </Badge>
                    </CardInteractive>
                  </li>
                )
              })}
            </ul>
          )}

        </div>

      </Card >
    </div >
  )
}

export default memo(SeleccionarCajaContenido)