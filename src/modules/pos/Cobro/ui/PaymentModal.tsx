import { useEffect, useState } from 'react'
import type { TipoPago } from '../../pos.types'
import type { EstadoCobro } from '../domain/cobro.types'
import { normalizarNumero } from './utils/normalizarNumero'
import PaymentSummary from './PaymentSummary'

/* ===============================
   Constantes UI
=============================== */

const TITULOS: Record<TipoPago, string> = {
  EFECTIVO: 'Pago en efectivo',
  DEBITO: 'Pago con débito',
  CREDITO: 'Pago con crédito',
  TRANSFERENCIA: 'Pago con transferencia',
  MIXTO: 'Pago mixto',
}

const ATAJOS = [1000, 2000, 5000, 10000, 20000]

/* ===============================
   Props
=============================== */

interface Props {
  totalVenta: number
  modo: TipoPago
  estado: EstadoCobro | null
  loading?: boolean

  /* setters desde useCobroPOS (DOMINIO) */
  setEfectivo: (value: string) => void
  setDebito: (value: string) => void

  /* flujo */
  onConfirm: () => void
  onClose: () => void
}

/**
 * PaymentModal
 *
 * - UI PURA
 * - Trabaja SOLO con strings (inputs reales)
 * - NO parsea dominio
 * - NO arma pagos
 * - NO valida reglas de negocio
 */
export default function PaymentModal({
  totalVenta,
  modo,
  estado,
  loading = false,
  setEfectivo,
  setDebito,
  onConfirm,
  onClose,
}: Props) {
  /* ===============================
     Estado local UI (strings)
  =============================== */
  const [efectivoRaw, setEfectivoRaw] = useState('')
  const [debitoRaw, setDebitoRaw] = useState('')

  /* ===============================
     Reset al cambiar modo o total
     (SIEMPRE strings)
  =============================== */
  useEffect(() => {
    setEfectivoRaw('')
    setDebitoRaw('')
    setEfectivo('')
    setDebito('')
  }, [modo, totalVenta, setEfectivo, setDebito])

  /* ===============================
     Handlers UI
  =============================== */

  const handleEfectivoChange = (raw: string) => {
    setEfectivoRaw(raw)

    // 👉 El dominio decide cómo interpretar el string
    setEfectivo(raw)

    // MIXTO: calculamos el resto solo para UI
    if (modo === 'MIXTO' && estado) {
      const num = normalizarNumero(raw)
      const resto = Math.max(
        0,
        estado.totalCobrado - num
      )

      const restoStr = resto ? String(resto) : ''
      setDebito(restoStr)
      setDebitoRaw(restoStr)
    }
  }

  const sumarEfectivo = (monto: number) => {
    const actual = normalizarNumero(efectivoRaw)
    const nuevo = actual + monto
    handleEfectivoChange(String(nuevo))
  }

  /* ===============================
     Render
  =============================== */

  if (!estado) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-[420px] shadow-2xl">

        {/* ===============================
            Título
        =============================== */}
        <h2 className="text-xl font-bold mb-3 text-white">
          {TITULOS[modo]}
        </h2>

        {/* ===============================
            Resumen financiero
        =============================== */}
        <PaymentSummary estado={estado} />

        {/* ===============================
            Inputs según modo
        =============================== */}

        {modo === 'EFECTIVO' && (
          <>
            <input
              autoFocus
              value={efectivoRaw}
              onChange={e =>
                handleEfectivoChange(
                  e.target.value
                )
              }
              inputMode="numeric"
              className="w-full bg-slate-700 p-3 rounded-lg text-3xl text-center mt-4"
              placeholder="0"
            />

            <div className="grid grid-cols-5 gap-2 mt-3">
              {ATAJOS.map(v => (
                <button
                  key={v}
                  onMouseDown={e => {
                    e.preventDefault()
                    sumarEfectivo(v)
                  }}
                  className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm"
                >
                  +${v / 1000}k
                </button>
              ))}
            </div>
          </>
        )}

        {modo === 'MIXTO' && (
          <div className="mt-4 space-y-2">
            <input
              value={efectivoRaw}
              onChange={e =>
                handleEfectivoChange(
                  e.target.value
                )
              }
              className="w-full bg-slate-700 p-2 rounded"
              placeholder="Efectivo"
              inputMode="numeric"
            />

            <input
              readOnly
              value={debitoRaw}
              className="w-full bg-slate-700 p-2 rounded opacity-60"
              placeholder="Débito"
            />
          </div>
        )}

        {modo !== 'EFECTIVO' &&
          modo !== 'MIXTO' && (
            <div className="mt-6 text-center text-emerald-400 text-3xl">
              $
              {estado.totalCobrado.toLocaleString(
                'es-CL'
              )}
            </div>
          )}

        {/* ===============================
            Acciones
        =============================== */}
        <div className="flex gap-3 mt-6">
          <button
            onMouseDown={e => {
              e.preventDefault()
              onClose()
            }}
            className="flex-1 bg-slate-600 p-2 rounded-lg"
          >
            Cancelar
          </button>

          <button
            disabled={
              !estado.puedeConfirmar || loading
            }
            onMouseDown={e => {
              e.preventDefault()
              onConfirm()
            }}
            className="flex-1 bg-emerald-600 p-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading
              ? 'Procesando…'
              : 'Cobrar'}
          </button>
        </div>

      </div>
    </div>
  )
}