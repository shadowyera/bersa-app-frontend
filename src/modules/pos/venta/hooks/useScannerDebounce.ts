import { useRef } from 'react'

export function useScannerDebounce(delay = 150) {
  const lastScanRef = useRef<number>(0)

  return () => {
    const now = Date.now()
    if (now - lastScanRef.current < delay) {
      return false
    }
    lastScanRef.current = now
    return true
  }
}