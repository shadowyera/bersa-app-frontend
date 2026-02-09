import { memo, useEffect, useState, useCallback, useRef } from 'react'
import type { TipoPago } from '../../domain/pos.types'
import type { EstadoCobro } from '../domain/cobro.types'
import { normalizarNumero } from './utils/normalizarNumero'
import PaymentSummary from './PaymentSummary'
import { useCobroShortcuts } from '../hooks/useCobroShortcuts'

/* =====================================================
   Constantes
===================================================== */

const TITULOS: Record<TipoPago, string> = {
  EFECTIVO: 'Pago en efectivo',
  DEBITO: 'Pago con débito',
  CREDITO: 'Pago con crédito',
  TRANSFERENCIA: 'Pago con transferencia',
  MIXTO: 'Pago mixto',
}

const ATAJOS = [1000, 2000, 5000, 10000, 20000]
const ATAJOS_KEYS = ['F1', 'F2', 'F3', 'F4', 'F5']

/* =====================================================
   Props
===================================================== */

interface Props {
  totalVenta: number
  modo: TipoPago
  estado: EstadoCobro | null
  loading?: boolean
  setEfectivo: (value: string) => void
  setDebito: (value: string) => void
  onConfirm: () => void
  onClose: () => void
}

/* =====================================================
   Component
===================================================== */

function PaymentModal({
  totalVenta,
  modo,
  estado,
  loading = false,
  setEfectivo,
  setDebito,
  onConfirm,
  onClose,
}: Props) {

  const [efectivoRaw, setEfectivoRaw] = useState('')
  const [, setDebitoRaw] = useState('')

  const efectivoRef = useRef<HTMLInputElement | null>(null)

  /* ===============================
     Shortcuts
  =============================== */

  const sumarEfectivo = useCallback(
    (monto: number) => {
      const actual = normalizarNumero(efectivoRaw)
      handleEfectivoChange(String(actual + monto))
    },
    [efectivoRaw]
  )

  useCobroShortcuts({
    enabled: true,
    onConfirm,
    onCancel: onClose,
    onAddMontoRapido: sumarEfectivo,
  })

  /* ===============================
     Autofocus seguro
  =============================== */

  useEffect(() => {
    if (modo !== 'EFECTIVO') return

    const id = requestAnimationFrame(() => {
      setTimeout(() => {
        if (!efectivoRef.current) return
        efectivoRef.current.focus()
        efectivoRef.current.select()
      }, 0)
    })

    return () => cancelAnimationFrame(id)
  }, [modo, totalVenta])

  /* ===============================
     Reset
  =============================== */

  useEffect(() => {
    setEfectivoRaw('')
    setDebitoRaw('')
    setEfectivo('')
    setDebito('')
  }, [modo, totalVenta, setEfectivo, setDebito])

  /* ===============================
     Handlers
  =============================== */

  const handleEfectivoChange = useCallback(
    (raw: string) => {
      setEfectivoRaw(raw)
      setEfectivo(raw)

      if (modo === 'MIXTO' && estado) {
        const num = normalizarNumero(raw)
        const resto = Math.max(0, estado.totalCobrado - num)
        const restoStr = resto > 0 ? String(resto) : ''

        setDebitoRaw(restoStr)
        setDebito(restoStr)
      }
    },
    [modo, estado, setEfectivo, setDebito]
  )

  /* ===============================
     Render
  =============================== */

  if (!estado) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-[420px] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">

        <h2 className="text-xl font-semibold mb-3">
          {TITULOS[modo]}
        </h2>

        <div className="text-center mb-4">
          <p className="text-xs text-slate-400">TOTAL A COBRAR</p>
          <p className="text-3xl font-bold text-emerald-400">
            ${estado.totalCobrado.toLocaleString('es-CL')}
          </p>
        </div>

        <PaymentSummary estado={estado} />

        {/* EFECTIVO */}
        {modo === 'EFECTIVO' && (

          <div className="mt-4 space-y-3">

            <label className="text-sm">
              Efectivo recibido
            </label>

            <input
              ref={efectivoRef}
              value={efectivoRaw}
              onChange={e => handleEfectivoChange(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-3xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="grid grid-cols-5 gap-2">
              {ATAJOS.map((v, i) => (
                <button
                  key={v}
                  onMouseDown={e => {
                    e.preventDefault()
                    sumarEfectivo(v)
                  }}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 py-2 text-sm flex flex-col items-center"
                >
                  <span>+${v / 1000}k</span>
                  <span className="text-[10px] text-slate-400">
                    ({ATAJOS_KEYS[i]})
                  </span>
                </button>
              ))}
            </div>

          </div>
        )}

        {estado.vuelto > 0 && (
          <p className="mt-3 text-emerald-400">
            CAMBIO: ${estado.vuelto.toLocaleString('es-CL')}
          </p>
        )}

        {estado.falta > 0 && (
          <p className="mt-3 text-red-400">
            FALTA: ${estado.falta.toLocaleString('es-CL')}
          </p>
        )}

        {/* Acciones */}

        <div className="mt-6 flex gap-3">

          <button
            onMouseDown={onClose}
            className="flex-1 rounded-xl bg-slate-700 hover:bg-slate-600 py-3 text-sm"
          >
            Cancelar (ESC)
          </button>

          <button
            disabled={!estado.puedeConfirmar || loading}
            onMouseDown={onConfirm}
            className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Procesando…' : 'Cobrar (Enter)'}
          </button>

        </div>

      </div>
    </div>
  )
}

export default memo(PaymentModal)