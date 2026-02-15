import { useEffect } from 'react'

interface Props {
  enabled: boolean
  onConfirm: () => void
  onCancel: () => void
  onDeleteDigit: () => void
  onAddMontoRapido: (monto: number) => void
}

export function useCobroShortcuts({
  enabled,
  onConfirm,
  onCancel,
  onDeleteDigit,
  onAddMontoRapido,
}: Props) {

  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {

      switch (e.key) {

        /* ===============================
           MONTOS RÁPIDOS
        =============================== */

        case 'F1':
          e.preventDefault()
          onAddMontoRapido(1000)
          return

        case 'F2':
          e.preventDefault()
          onAddMontoRapido(2000)
          return

        case 'F3':
          e.preventDefault()
          onAddMontoRapido(5000)
          return

        case 'F4':
          e.preventDefault()
          onAddMontoRapido(10000)
          return

        case 'F5':
          e.preventDefault()
          onAddMontoRapido(20000)
          return

        /* ===============================
           CONFIRMAR
        =============================== */

        case 'Enter':
          e.preventDefault()
          onConfirm()
          return

        /* ===============================
           BORRAR (solo efectivo / mixto)
        =============================== */

        case 'Backspace':
          e.preventDefault()
          onDeleteDigit()
          return

        /* ===============================
           CANCELAR
        =============================== */

        case 'Escape':
          e.preventDefault()
          onCancel()
          return
      }
    }

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }

  }, [
    enabled,
    onConfirm,
    onCancel,
    onDeleteDigit,
    onAddMontoRapido,
  ])
}