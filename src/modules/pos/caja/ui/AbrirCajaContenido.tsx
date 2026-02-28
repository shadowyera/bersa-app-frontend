import { memo, useCallback, useMemo, useState } from 'react'
import { useCaja } from '../context/CajaProvider'

import { Card } from '@/shared/ui/card/Card'
import { Button } from '@/shared/ui/button/button'
import { Input } from '@/shared/ui/input/input'
import { Label } from '@/shared/ui/label/label'
import { Separator } from '@/shared/ui/separator/separator'

function AbrirCajaContenido() {
  const {
    cajaSeleccionada,
    aperturaActiva,
    abrirCaja,
    deseleccionarCaja,
    cargando,
  } = useCaja()

  const [montoInicial, setMontoInicial] =
    useState('')

  if (!cajaSeleccionada || aperturaActiva)
    return null

  /* =====================================================
     Validaciones UI
  ===================================================== */

  const montoValido = useMemo(() => {
    if (montoInicial === '') return false
    const monto = Number(montoInicial)
    return !Number.isNaN(monto) && monto >= 0
  }, [montoInicial])

  /* =====================================================
     Handlers
  ===================================================== */

  const handleConfirmar = useCallback(async () => {
    if (!montoValido) return
    await abrirCaja(Number(montoInicial))
  }, [montoInicial, montoValido, abrirCaja])

  const handleChangeMonto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMontoInicial(e.target.value)
    },
    []
  )

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        handleConfirmar()
      }}
      className="w-full max-w-sm"
    >
      <Card className="overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Apertura de caja
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Confirma los datos antes de comenzar el turno
          </p>
        </div>

        <Separator />

        {/* Body */}
        <div className="px-6 py-6 space-y-6">

          {/* Caja seleccionada */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-foreground/60">
              Caja seleccionada
            </div>
            <div className="mt-1 text-lg font-semibold text-primary">
              {cajaSeleccionada.nombre}
            </div>
          </div>

          {/* Monto inicial */}
          <div className="space-y-2">
            <Label>
              Monto inicial en efectivo
            </Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 text-sm">
                $
              </span>

              <Input
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={montoInicial}
                onChange={handleChangeMonto}
                disabled={cargando}
                className="pl-8 text-base"
              />
            </div>

            <p className="text-xs text-foreground/60">
              Este monto quedará registrado como efectivo inicial de la caja
            </p>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="px-6 py-4 flex flex-col gap-3">

          <Button
            type="submit"
            size="lg"
            variant="primary"
            disabled={cargando || !montoValido}
          >
            {cargando
              ? 'Abriendo caja…'
              : 'Confirmar apertura'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={cargando}
            onClick={deseleccionarCaja}
          >
            ← Cambiar caja seleccionada
          </Button>

        </div>

      </Card>
    </form>
  )
}

export default memo(AbrirCajaContenido)