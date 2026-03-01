import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useScanProduct } from './useScanProduct'
import { useToast } from '@/shared/ui/toast/ToastProvider'

import type { Producto } from '@/domains/producto/domain/producto.types'

/* =====================================================
   Hook debounce simple (anti doble scan físico)
===================================================== */

function useScannerDebounce(delay = 150) {
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

/* =====================================================
   Types
===================================================== */

interface Props {
  onAddProduct: (producto: Producto) => void
  scannerRef: React.RefObject<HTMLInputElement | null>
}

/* =====================================================
   Component
===================================================== */

function ProductScanner({
  onAddProduct,
  scannerRef,
}: Props) {

  const [value, setValue] = useState('')
  const scanningRef = useRef(false)

  const { scan } = useScanProduct()
  const { showToast } = useToast()

  const canScan = useScannerDebounce(150)

  /* ===============================
     Mantener foco constante
  =============================== */

  useEffect(() => {
    const input = scannerRef.current
    if (!input) return

    input.focus()

    const handleBlur = () => {
      // Recupera foco automáticamente
      setTimeout(() => {
        input.focus()
      }, 0)
    }

    input.addEventListener('blur', handleBlur)

    return () => {
      input.removeEventListener('blur', handleBlur)
    }
  }, [scannerRef])

  /* ===============================
     Procesar escaneo
  =============================== */

  const handleScan = useCallback(async () => {

    const code = value.trim()
    if (!code || code.length < 4) return
    if (!canScan()) return
    if (scanningRef.current) return

    scanningRef.current = true

    try {
      const producto = await scan(code)

      onAddProduct(producto)

    } catch (e) {

      if (e instanceof Error) {
        switch (e.message) {
          case 'NOT_FOUND':
            showToast('Producto no encontrado', 'error')
            break

          case 'INACTIVE':
            showToast('Producto no habilitado', 'warning')
            break

          default:
            showToast('Error al buscar producto', 'error')
        }
      }

    } finally {
      scanningRef.current = false
      setValue('')
      scannerRef.current?.focus()
    }

  }, [value, scan, onAddProduct, showToast, scannerRef, canScan])

  /* ===============================
     Handlers input
  =============================== */

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    []
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleScan()
      }
    },
    [handleScan]
  )

  /* ===============================
     Render
  =============================== */

  return (
    <div className="absolute top-0 left-0 opacity-0 pointer-events-none">
      <input
        ref={scannerRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  )
}

export default memo(ProductScanner)