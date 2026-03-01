import { memo, useEffect, useCallback, useRef } from 'react'
import type { TipoPago } from '@/domains/venta/domain/pago/pago.types'
import type { EstadoCobro } from '@/domains/venta/domain/cobro/cobro.types'
import { normalizarNumero } from './utils/normalizarNumero'
import PaymentSummary from './PaymentSummary'
import { usePagoShortcuts } from '../hooks/usePagoShortcuts'

import { Card } from '@/shared/ui/card/Card'
import { Button } from '@/shared/ui/button/button'
import { Input } from '@/shared/ui/input/input'

/* ===================================================== */

const TITULOS: Record<TipoPago, string> = {
  EFECTIVO: 'Pago en efectivo',
  DEBITO: 'Pago con débito',
  CREDITO: 'Pago con crédito',
  TRANSFERENCIA: 'Pago con transferencia',
  MIXTO: 'Pago mixto',
}

const ATAJOS = [1000, 2000, 5000, 10000, 20000]
const ATAJOS_KEYS = ['F1', 'F2', 'F3', 'F4', 'F5']

/* ===================================================== */

interface Props {
  totalVenta: number
  modo: TipoPago
  estado: EstadoCobro | null
  loading?: boolean
  efectivoRaw: string
  debitoRaw: string
  setEfectivo: (value: string) => void
  setDebito: (value: string) => void
  onConfirm: () => void
  onClose: () => void
}

/* ===================================================== */

function PaymentModal({
  modo,
  estado,
  loading = false,
  efectivoRaw,
  debitoRaw,
  setEfectivo,
  onConfirm,
  onClose,
}: Props) {

  const efectivoRef = useRef<HTMLInputElement | null>(null)

  const handleEfectivoChange = useCallback(
    (raw: string) => {
      setEfectivo(raw)
    },
    [setEfectivo]
  )

  usePagoShortcuts({
    enabled: true,
    onConfirm,
    onCancel: onClose,
    onDeleteDigit: () =>
      setEfectivo(efectivoRaw.slice(0, -1)),
    onAddMontoRapido: (monto) => {
      const actual = normalizarNumero(efectivoRaw)
      setEfectivo(String(actual + monto))
    },
  })

  useEffect(() => {
    if (modo !== 'EFECTIVO' && modo !== 'MIXTO') return
    efectivoRef.current?.focus()
    efectivoRef.current?.select()
  }, [modo])

  if (!estado) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">

      <Card className="w-[440px] p-6 space-y-6 shadow-2xl">

        {/* Header */}
        <h2 className="text-xl font-semibold text-foreground">
          {TITULOS[modo]}
        </h2>

        {/* Total */}
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            TOTAL A PAGAR
          </p>

          <p className="text-4xl font-bold text-primary tracking-tight">
            ${estado.totalCobrado.toLocaleString('es-CL')}
          </p>
        </div>

        {/* Resumen */}
        <PaymentSummary estado={estado} />

        {/* EFECTIVO */}
        {(modo === 'EFECTIVO' || modo === 'MIXTO') && (
          <div className="space-y-4">

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                EFECTIVO
              </p>

              <Input
                ref={efectivoRef}
                value={efectivoRaw}
                onChange={e => handleEfectivoChange(e.target.value)}
                inputMode="numeric"
                placeholder="0"
                className="
    h-16
    text-4xl
    text-center
    font-bold
    tracking-tight
  "
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {ATAJOS.map((monto, i) => (
                <Button
                  key={monto}
                  variant="outline"
                  size="md"
                  onMouseDown={e => {
                    e.preventDefault()
                    const actual = normalizarNumero(efectivoRaw)
                    setEfectivo(String(actual + monto))
                  }}
                  className="
                    h-12
                    flex flex-col
                    items-center
                    justify-center
                  "
                >
                  <span className="font-medium">
                    +${monto / 1000}k
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    ({ATAJOS_KEYS[i]})
                  </span>
                </Button>
              ))}
            </div>

          </div>
        )}

        {/* DÉBITO MIXTO */}
        {modo === 'MIXTO' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              DÉBITO
            </p>

            <Input
              value={normalizarNumero(debitoRaw).toLocaleString('es-CL')}
              readOnly
              className="
                h-12
                text-2xl
                text-center
                font-medium
                opacity-80
              "
            />
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-3 pt-2">

          <Button
            variant="secondary"
            className="flex-1 h-12"
            onMouseDown={onClose}
          >
            Cancelar (ESC)
          </Button>

          <Button
            variant="primary"
            className="flex-1 h-12"
            disabled={!estado.puedeConfirmar || loading}
            onMouseDown={onConfirm}
          >
            Pagar (Enter)
          </Button>

        </div>

        <p className="text-xs text-muted-foreground text-center">
          F1–F5 → montos rápidos · Backspace → borrar · ESC → cancelar
        </p>

      </Card>
    </div>
  )
}

export default memo(PaymentModal)