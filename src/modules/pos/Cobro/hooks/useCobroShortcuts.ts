import { useEffect } from 'react'

interface Props {
  enabled: boolean
  onConfirm: () => void
  onCancel: () => void
  onAddMontoRapido: (monto: number) => void
}

export function useCobroShortcuts({
  enabled,
  onConfirm,
  onCancel,
  onAddMontoRapido,
}: Props) {

  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {

      switch (e.key) {

        case 'F1':
          e.preventDefault()
          onAddMontoRapido(1000)
          break

        case 'F2':
          e.preventDefault()
          onAddMontoRapido(2000)
          break

        case 'F3':
          e.preventDefault()
          onAddMontoRapido(5000)
          break

        case 'F4':
          e.preventDefault()
          onAddMontoRapido(10000)
          break

        case 'F5':
          e.preventDefault()
          onAddMontoRapido(20000)
          break

        case 'Enter':
          e.preventDefault()
          onConfirm()
          break

        case 'Escape':
          e.preventDefault()
          onCancel()
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () =>
      window.removeEventListener('keydown', handler)

  }, [
    enabled,
    onConfirm,
    onCancel,
    onAddMontoRapido,
  ])
}