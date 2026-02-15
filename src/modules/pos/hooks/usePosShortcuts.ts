import { useEffect } from 'react'
import type { TipoPago } from '../domain/pos.types'

export type ShortcutMode =
  | 'VENTA'
  | 'TIPO_PAGO'
  | 'PAGO'
  | null

interface Props {
  mode: ShortcutMode

  /* venta */
  onCobrar: () => void
  onIncreaseLast: () => void
  onDecreaseLast: () => void

  /* tipo pago */
  onSelectTipoPago?: (tipo: TipoPago) => void

  /* pago */
  onConfirmPago?: () => void

  /* común */
  onBack?: () => void
}

export function usePosShortcuts({
  mode,

  onCobrar,
  onIncreaseLast,
  onDecreaseLast,

  onSelectTipoPago,
  onConfirmPago,

  onBack,
}: Props) {

  useEffect(() => {

    if (!mode) return

    const handler = (e: KeyboardEvent) => {

      const tag =
        (e.target as HTMLElement)?.tagName

      // En venta permitimos shortcuts aunque haya input
      if (
        mode !== 'VENTA' &&
        (tag === 'INPUT' || tag === 'TEXTAREA')
      ) {
        return
      }

      /* ===============================
         MODO VENTA
      =============================== */

      if (mode === 'VENTA') {

        if (e.key === 'F2') {
          e.preventDefault()
          onCobrar()
          return
        }

        if (
          e.key === '+' ||
          e.key === '=' ||
          e.code === 'NumpadAdd'
        ) {
          e.preventDefault()
          onIncreaseLast()
          return
        }

        if (
          e.key === '-' ||
          e.code === 'Minus' ||
          e.code === 'NumpadSubtract'
        ) {
          e.preventDefault()
          onDecreaseLast()
          return
        }
      }

      /* ===============================
         MODO TIPO PAGO
      =============================== */

      if (mode === 'TIPO_PAGO') {

        if (!onSelectTipoPago) return

        if (e.key === '1') {
          e.preventDefault()
          onSelectTipoPago('EFECTIVO')
          return
        }

        if (e.key === '2') {
          e.preventDefault()
          onSelectTipoPago('DEBITO')
          return
        }

        if (e.key === '3') {
          e.preventDefault()
          onSelectTipoPago('CREDITO')
          return
        }

        if (e.key === '4') {
          e.preventDefault()
          onSelectTipoPago('TRANSFERENCIA')
          return
        }

        if (e.key === 'Escape') {
          e.preventDefault()
          onBack?.()
          return
        }
      }

      /* ===============================
         MODO PAGO
      =============================== */

      if (mode === 'PAGO') {

        if (e.key === 'Enter') {
          e.preventDefault()
          onConfirmPago?.()
          return
        }

        if (e.key === 'Escape') {
          e.preventDefault()
          onBack?.()
          return
        }
      }
    }

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener(
        'keydown',
        handler
      )
    }
  }, [
    mode,

    onCobrar,
    onIncreaseLast,
    onDecreaseLast,

    onSelectTipoPago,
    onConfirmPago,

    onBack,
  ])
}