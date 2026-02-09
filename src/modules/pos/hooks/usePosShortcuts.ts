import { useEffect } from 'react'

interface Props {
  enabled: boolean
  onCobrar: () => void
  onIncreaseLast: () => void
  onDecreaseLast: () => void
}

export function usePosShortcuts({
  enabled,
  onCobrar,
  onIncreaseLast,
  onDecreaseLast,
}: Props) {

  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {

      console.log('KEY:', e.key, 'CODE:', e.code)

      if (e.key === 'Enter') {
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

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [
    enabled,
    onCobrar,
    onIncreaseLast,
    onDecreaseLast,
  ])
}