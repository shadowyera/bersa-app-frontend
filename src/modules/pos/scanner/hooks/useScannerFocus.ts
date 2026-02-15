import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook de infraestructura UI para el scanner.
 *
 * - Mantiene el foco en el input del scanner
 * - Expone la ref del input
 * - Permite forzar el foco manualmente
 *
 * No conoce POS, venta ni caja.
 */
export function useScannerFocus() {
  // Ref del input invisible del scanner
  const scannerRef = useRef<HTMLInputElement | null>(null)

  // Fuerza el foco en el scanner
  const focusScanner = useCallback(() => {
    scannerRef.current?.focus()
  }, [])

  // Mantiene el foco del scanner ante clicks en la pantalla
  useEffect(() => {
    const keepFocus = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Si el foco va a un input editable, no lo robamos
      if (
        target.closest(
          "input, textarea, [contenteditable='true']"
        ) &&
        !target.closest('#scanner-input')
      ) {
        return
      }

      // Re-enfocamos el scanner en el siguiente frame
      requestAnimationFrame(() => {
        scannerRef.current?.focus()
      })
    }

    document.addEventListener('mousedown', keepFocus)

    return () => {
      document.removeEventListener(
        'mousedown',
        keepFocus
      )
    }
  }, [])

  return {
    scannerRef,
    focusScanner,
  }
}