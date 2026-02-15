import { useEffect } from 'react'
import type { TipoPago } from '../../domain/pos.types'

interface Props {
  enabled: boolean
  onSelect: (tipo: TipoPago) => void
  onCancel: () => void
}

const ORDER: TipoPago[] = [
  'EFECTIVO',
  'DEBITO',
  'CREDITO',
  'MIXTO',
  'TRANSFERENCIA',
]

export function useTipoPagoShortcuts({
  enabled,
  onSelect,
  onCancel,
}: Props) {

  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {

      switch (e.key) {

        case '1':
          e.preventDefault()
          onSelect(ORDER[0])
          return

        case '2':
          e.preventDefault()
          onSelect(ORDER[1])
          return

        case '3':
          e.preventDefault()
          onSelect(ORDER[2])
          return

        case '4':
          e.preventDefault()
          onSelect(ORDER[3])
          return

        case '5':
          e.preventDefault()
          onSelect(ORDER[4])
          return

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
    onSelect,
    onCancel,
  ])
}