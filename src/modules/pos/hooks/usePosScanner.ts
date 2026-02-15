import { useScannerFocus } from '../scanner/hooks/useScannerFocus'

export function usePosScanner() {
  const { scannerRef, focusScanner } =
    useScannerFocus()

  return { scannerRef, focusScanner }
}