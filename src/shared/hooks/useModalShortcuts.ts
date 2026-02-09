import { useEffect } from 'react'

interface Props {
  enabled: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

export function useModalShortcuts({
  enabled,
  onConfirm,
  onCancel,
}: Props) {

  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {

      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel?.()
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        onConfirm?.()
      }
    }

    window.addEventListener('keydown', handler)
    return () =>
      window.removeEventListener('keydown', handler)

  }, [enabled, onConfirm, onCancel])
}
