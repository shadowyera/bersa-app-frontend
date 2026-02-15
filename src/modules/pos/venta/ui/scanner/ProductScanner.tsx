import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useScanProduct } from './useScanProduct'
import { useScannerToast } from './useScannerToast'

/* =====================================================
   Hook debounce simple
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
  onAddProduct: (producto: {
    _id: string
    nombre: string
    precio: number
    codigo?: string
    activo: boolean
    categoriaId?: string
  }) => void

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

  const { scan } = useScanProduct()
  const { toast, showToast } = useScannerToast()

  const canScan = useScannerDebounce(150)

  /* ===============================
     Foco inicial
  =============================== */

  useEffect(() => {
    scannerRef.current?.focus()
  }, [scannerRef])

  /* ===============================
     Procesar escaneo
  =============================== */

  const handleScan = useCallback(async () => {
    const code = value.trim()
    if (!code) return

    // ⛔ evita doble scan
    if (!canScan()) return

    try {
      const producto = await scan(code)
      onAddProduct(producto)
    } catch (e) {
      if (e instanceof Error) {
        switch (e.message) {
          case 'NOT_FOUND':
            showToast('Producto no encontrado')
            break
          case 'INACTIVE':
            showToast('Producto no habilitado')
            break
          default:
            showToast('Error al buscar producto')
        }
      }
    } finally {
      setValue('')
      scannerRef.current?.focus()
    }
  }, [value, scan, onAddProduct, showToast, scannerRef, canScan])

  /* ===============================
     Input handlers
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
    <>
      {/* INPUT INVISIBLE (scanner) */}
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

      {/* TOAST */}
      {toast && (
        <div
          className="
            fixed top-4 right-4 z-[9999]
            rounded-md bg-red-600/90
            px-4 py-2 text-sm font-medium text-white
            shadow-lg
          "
        >
          {toast}
        </div>
      )}
    </>
  )
}

export default memo(ProductScanner)