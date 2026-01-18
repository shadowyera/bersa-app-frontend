import { memo, useCallback } from 'react'
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

  // ✅ Hooks SIEMPRE antes de cualquier return
  const handleChangeMonto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMontoFinal(e.target.value)
    },
    [setMontoFinal]
  )

  const handleConfirmar = useCallback(() => {
    confirmarCierre()
  }, [confirmarCierre])

  const handleCancelar = useCallback(() => {
    cancelarCierre()
  }, [cancelarCierre])

  // ✅ Return DESPUÉS de los hooks
  if (!aperturaActiva || !showCierreModal)
    return null

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
            disabled={closingCaja}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-sm font-medium"
          >
            {closingCaja
              ? 'Cerrando…'
              : 'Confirmar cierre'}
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
        <div className="space-y-5">
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
              label="Efectivo ventas"
              value={resumenPrevio.efectivoVentas}
            />
            <ResumenItem
              label="Efectivo esperado"
              value={resumenPrevio.efectivoEsperado}
              highlight
            />
          </div>

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
                bg-slate-800 border border-slate-700
                px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-red-500
              "
            />
          </div>
        </div>
      )}
    </ModalBase>
  )
}

export default memo(CerrarCajaModal)

/* --------------------------- */

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