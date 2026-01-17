import { useCallback, useEffect, useRef } from 'react'

/**
 * useScannerFocus
 *
 * Hook responsable de:
 * - Mantener el foco permanente en el input del scanner
 * - Exponer una ref para el input
 * - Exponer una función para forzar el foco manualmente
 *
 * NO sabe nada de:
 * - POS
 * - Caja
 * - Venta
 * - Cobro
 *
 * Es un hook de infraestructura UI.
 */
export function useScannerFocus() {
  /**
   * Ref del input del scanner
   */
  const scannerRef = useRef<HTMLInputElement | null>(null)

  /**
   * Fuerza el foco en el scanner
   * Se usa después de agregar productos,
   * cerrar modales, clicks, etc.
   */
  const focusScanner = useCallback(() => {
    scannerRef.current?.focus()
  }, [])

  /**
   * Mantiene el foco del scanner incluso
   * cuando el usuario hace click en otras partes
   * de la pantalla (excepto inputs editables).
   */
  useEffect(() => {
    const keepFocus = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Si el usuario hace foco en otro input editable,
      // NO robamos el foco
      if (
        target.closest(
          "input, textarea, [contenteditable='true']"
        ) &&
        !target.closest('#scanner-input')
      ) {
        return
      }

      // Volvemos a enfocar el scanner en el próximo frame
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