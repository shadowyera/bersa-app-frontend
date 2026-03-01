import { memo, useCallback } from 'react'
import { PAYMENT_METHODS } from '@/domains/venta/domain/pago/pago.logic'
import type { TipoPago } from '@/domains/venta/domain/pago/pago.types'
import { useTipoPagoShortcuts } from '../hooks/useTipoPagoShortcuts'

import { Card, CardInteractive } from '@/shared/ui/card/Card'
import { Button } from '@/shared/ui/button/button'

/* ===================================================== */

interface Props {
  onSelect: (tipo: TipoPago) => void
  onClose: () => void
}

/* ===================================================== */

function SeleccionarTipoPagoModal({
  onSelect,
  onClose,
}: Props) {

  const handleSelect = useCallback(
    (tipo: TipoPago) => {
      onSelect(tipo)
    },
    [onSelect]
  )

  const handleClose = useCallback(
    () => {
      onClose()
    },
    [onClose]
  )

  useTipoPagoShortcuts({
    enabled: true,
    onSelect: handleSelect,
    onCancel: handleClose,
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">

      <Card className="w-[420px] p-6 space-y-5 shadow-2xl">

        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            ¿Cómo paga el cliente?
          </h2>
          <p className="text-sm text-muted-foreground">
            Selecciona el método de pago
          </p>
        </div>

        {/* Métodos */}
        <div className="space-y-3">
          {(Object.keys(PAYMENT_METHODS) as TipoPago[]).map(
            (tipo, index) => {

              const metodo = PAYMENT_METHODS[tipo]

              return (
                <CardInteractive
                  key={tipo}
                  onMouseDown={e => {
                    e.preventDefault()
                    handleSelect(tipo)
                  }}
                  className="w-full p-4"
                >
                  <div className="text-base font-semibold text-foreground flex items-center gap-3">
                    
                    <span className="
                      w-6 h-6
                      flex items-center justify-center
                      rounded-md
                      bg-surface
                      border border-border
                      text-xs
                      text-muted-foreground
                    ">
                      {index + 1}
                    </span>

                    {metodo.label}
                  </div>

                  <div className="text-sm text-muted-foreground mt-1 ml-9">
                    {metodo.description}
                  </div>
                </CardInteractive>
              )
            }
          )}
        </div>

        {/* Footer */}
        <Button
          variant="secondary"
          className="w-full"
          onMouseDown={e => {
            e.preventDefault()
            handleClose()
          }}
        >
          Cancelar (ESC)
        </Button>

      </Card>

    </div>
  )
}

export default memo(SeleccionarTipoPagoModal)