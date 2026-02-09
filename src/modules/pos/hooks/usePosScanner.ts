import { useScannerFocus } from '../venta/hooks/useScannerFocus'

export function usePosScanner() {
  const { scannerRef, focusScanner } =
    useScannerFocus()

  return { scannerRef, focusScanner }
}