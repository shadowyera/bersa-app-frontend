import { useCallback, useEffect, useState } from 'react'

/**
 * Hook de toast simple y autodestructivo.
 *
 * - Pensado para feedback rápido del scanner
 * - Muestra un solo mensaje a la vez
 * - Se oculta automáticamente después del timeout
 *
 * ⚠️ No renderiza UI: solo expone estado y acción
 */
export function useScannerToast(timeout = 2000) {
  // Mensaje actual del toast (null = oculto)
  const [toast, setToast] = useState<string | null>(null)

  // Muestra un mensaje de toast
  const showToast = useCallback((message: string) => {
    setToast(message)
  }, [])

  // Auto-cierre del toast
  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(
      () => setToast(null),
      timeout
    )

    return () => clearTimeout(timer)
  }, [toast, timeout])

  return {
    toast,
    showToast,
  }
}