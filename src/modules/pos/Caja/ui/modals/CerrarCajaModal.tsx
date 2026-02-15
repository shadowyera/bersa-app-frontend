import React, { memo, useCallback, useMemo, useState } from 'react'
import ModalBase from './ModalBase'
import { useCaja } from '../../context/CajaProvider'

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

  /* =========================
     Local state
  ========================= */

  const [motivo, setMotivo] = useState('')

  /* =========================
     Handlers
  ========================= */

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

  /* =========================
     Diferencia
  ========================= */

  const diferencia = useMemo(() => {
    if (!resumenPrevio) return 0
    const contado = Number(montoFinal) || 0
    return contado - resumenPrevio.efectivoEsperado
  }, [montoFinal, resumenPrevio])

  const requiereMotivo = diferencia !== 0
  const motivoValido = motivo.trim().length > 0

  if (!aperturaActiva || !showCierreModal)
    return null

  /* =========================
     Render
  ========================= */

  return (
    <ModalBase
      title="Cierre de caja"
      onClose={handleCancelar}
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-3">

          <button
            onClick={handleCancelar}
            disabled={closingCaja}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirmar}
            disabled={
              closingCaja ||
              (requiereMotivo && !motivoValido)
            }
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              ${
                closingCaja ||
                (requiereMotivo && !motivoValido)
                  ? 'bg-red-600/40 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500'
              }
            `}
          >
            {closingCaja ? 'Cerrando…' : 'Confirmar cierre'}
          </button>

        </div>
      }
    >

      {cargando && (
        <p className="text-slate-400">
          Calculando resumen…
        </p>
      )}

      {!cargando && resumenPrevio && (
        <div className="space-y-6">

          {/* ========== Totales ========== */}

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

          {/* ========== Desglose ========== */}

          {resumenPrevio.pagosPorTipo && (
            <div>

              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                Desglose de ventas
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">

                <LineaPago label="Débito" value={resumenPrevio.pagosPorTipo.DEBITO} />
                <LineaPago label="Crédito" value={resumenPrevio.pagosPorTipo.CREDITO} />
                <LineaPago label="Transferencia" value={resumenPrevio.pagosPorTipo.TRANSFERENCIA} />
                <LineaPago label="Efectivo" value={resumenPrevio.pagosPorTipo.EFECTIVO} />

              </div>

            </div>
          )}

          {/* ========== Input efectivo ========== */}

          <div>

            <label className="block text-sm mb-1 text-slate-300">
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
                bg-slate-900 border border-slate-700
                px-3 py-2 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-emerald-500
              "
            />

          </div>

          {/* ========== Diferencia ========== */}

          <div
            className={`text-sm font-medium ${
              diferencia === 0
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}
          >
            Diferencia: ${diferencia.toLocaleString('es-CL')}
          </div>

          {/* ========== Motivo (condicional) ========== */}

          {requiereMotivo && (
            <div>

              <label className="block text-sm mb-1 text-slate-300">
                Motivo de diferencia
              </label>

              <textarea
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                rows={3}
                placeholder="Ej: faltante efectivo, error digitación, cliente se fue sin pagar..."
                className="
                  w-full rounded-lg
                  bg-slate-900 border border-slate-700
                  px-3 py-2 text-sm
                  resize-none
                  focus:outline-none
                  focus:ring-2 focus:ring-red-500
                "
              />

            </div>
          )}

          <div className="text-xs text-slate-400">
            Verifique el efectivo contado antes de confirmar el cierre.
          </div>

        </div>
      )}

    </ModalBase>
  )
}

export default memo(CerrarCajaModal)

/* =====================================================
   Subcomponentes
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
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-slate-700 bg-slate-800'
        }
      `}
    >
      <div className="text-xs text-slate-400">
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
    <div className="flex justify-between text-slate-300">
      <span>{label}</span>
      <span>
        ${value.toLocaleString('es-CL')}
      </span>
    </div>
  )
})