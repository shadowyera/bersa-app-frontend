import React, { memo, useCallback, useMemo, useState } from 'react'
import ModalBase from './ModalBase'
import { useCaja } from '../../context/CajaProvider'
import { Button } from '@/shared/ui/button/button'

function CerrarCajaModal() {

  const {
    aperturaActiva,
    showCierreModal,
    resumenPrevio,
    montoFinal,
    setMontoFinal,
    confirmarCierre,
    cancelarCierre,
    cargando,
    closingCaja,
  } = useCaja()

  const [motivo, setMotivo] = useState('')

  const handleChangeMonto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMontoFinal(e.target.value)
    },
    [setMontoFinal]
  )

  const handleConfirmar = useCallback(() => {
    confirmarCierre(motivo)
  }, [confirmarCierre, motivo])

  const handleCancelar = useCallback(() => {
    setMotivo('')
    cancelarCierre()
  }, [cancelarCierre])

  const diferencia = useMemo(() => {
    if (!resumenPrevio) return 0
    const contado = Number(montoFinal) || 0
    return contado - resumenPrevio.efectivoEsperado
  }, [montoFinal, resumenPrevio])

  const requiereMotivo = diferencia !== 0
  const motivoValido = motivo.trim().length > 0

  if (!aperturaActiva || !showCierreModal)
    return null

  return (
    <ModalBase
      title="Cierre de caja"
      onClose={handleCancelar}
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={handleCancelar}
            disabled={closingCaja}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={handleConfirmar}
            disabled={
              closingCaja ||
              (requiereMotivo && !motivoValido)
            }
          >
            {closingCaja ? 'Cerrando…' : 'Confirmar cierre'}
          </Button>
        </div>
      }
    >

      {cargando && (
        <p className="text-muted-foreground">
          Calculando resumen…
        </p>
      )}

      {!cargando && resumenPrevio && (
        <div className="space-y-6">

          {/* Totales */}
          <div className="grid grid-cols-2 gap-4 text-sm">

            <ResumenItem
              label="Monto inicial"
              value={resumenPrevio.montoInicial}
            />

            <ResumenItem
              label="Total ventas"
              value={resumenPrevio.totalVentas}
            />

            <ResumenItem
              label="Efectivo esperado"
              value={resumenPrevio.efectivoEsperado}
              highlight
            />

          </div>

          {/* Desglose */}
          {resumenPrevio.pagosPorTipo && (
            <div>

              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Desglose de ventas
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">

                <LineaPago label="Débito" value={resumenPrevio.pagosPorTipo.DEBITO} />
                <LineaPago label="Crédito" value={resumenPrevio.pagosPorTipo.CREDITO} />
                <LineaPago label="Transferencia" value={resumenPrevio.pagosPorTipo.TRANSFERENCIA} />
                <LineaPago label="Efectivo" value={resumenPrevio.pagosPorTipo.EFECTIVO} />

              </div>

            </div>
          )}

          {/* Input efectivo */}
          <div>

            <label className="block text-sm mb-1 text-muted-foreground">
              Efectivo contado
            </label>

            <input
              type="number"
              inputMode="numeric"
              autoFocus
              value={montoFinal}
              onChange={handleChangeMonto}
              disabled={closingCaja}
              className="
                w-full rounded-lg
                bg-background border border-border
                px-3 py-2 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-primary/40
              "
            />

          </div>

          {/* Diferencia */}
          <div
            className={`
              text-sm font-medium
              ${diferencia === 0
                ? 'text-success'
                : 'text-danger'
              }
            `}
          >
            Diferencia: ${diferencia.toLocaleString('es-CL')}
          </div>

          {/* Motivo */}
          {requiereMotivo && (
            <div>

              <label className="block text-sm mb-1 text-muted-foreground">
                Motivo de diferencia
              </label>

              <textarea
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                rows={3}
                placeholder="Ej: faltante efectivo, error digitación..."
                className="
                  w-full rounded-lg
                  bg-background border border-border
                  px-3 py-2 text-sm
                  resize-none
                  focus:outline-none
                  focus:ring-2 focus:ring-primary/40
                "
              />

            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Verifique el efectivo contado antes de confirmar el cierre.
          </div>

        </div>
      )}

    </ModalBase>
  )
}

export default memo(CerrarCajaModal)

/* =====================================================
   Subcomponentes privados
===================================================== */

interface ResumenItemProps {
  label: string
  value: number
  highlight?: boolean
}

const ResumenItem = memo(function ResumenItem({
  label,
  value,
  highlight,
}: ResumenItemProps) {
  return (
    <div
      className={`
        rounded-lg p-3 border
        ${
          highlight
            ? 'border-primary/40 bg-primary/5'
            : 'border-border bg-background'
        }
      `}
    >
      <div className="text-xs text-muted-foreground">
        {label}
      </div>

      <div className="text-lg font-semibold">
        ${value.toLocaleString('es-CL')}
      </div>
    </div>
  )
})

interface LineaPagoProps {
  label: string
  value: number
}

const LineaPago = memo(function LineaPago({
  label,
  value,
}: LineaPagoProps) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium">
        ${value.toLocaleString('es-CL')}
      </span>
    </div>
  )
})