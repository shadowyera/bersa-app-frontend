import { useCallback, useEffect, useState } from 'react'

/**
 * Hook simple de toast autodestructivo
 * - pensado para scanner
 */
export function useScannerToast(timeout = 2000) {
  const [toast, setToast] = useState<string | null>(
    null
  )

  const showToast = useCallback(
    (message: string) => {
      setToast(message)
    },
    []
  )

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(
      () => setToast(null),
      timeout
    )
    return () => clearTimeout(t)
  }, [toast, timeout])

  return {
    toast,
    showToast,
  }
}