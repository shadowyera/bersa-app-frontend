import { memo, useCallback, useEffect, useState } from 'react'
import { useScanProduct } from './useScanProduct'
import { useScannerToast } from './useScannerToast'

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

/**
 * ProductScanner
 *
 * Responsabilidad:
 * - Capturar input de pistola
 * - Orquestar hooks
 * - Renderizar feedback visual
 *
 * ❗ NO contiene lógica de negocio
 */
function ProductScanner({
  onAddProduct,
  scannerRef,
}: Props) {
  const [value, setValue] = useState('')

  const { scan } = useScanProduct()
  const { toast, showToast } = useScannerToast()

  /* ===============================
     Foco inicial
  =============================== */
  useEffect(() => {
    scannerRef.current?.focus()
  }, [scannerRef])

  /* ===============================
     Procesar escaneo (ESTABLE)
  =============================== */
  const handleScan = useCallback(async () => {
    const code = value.trim()
    if (!code) return

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
  }, [value, scan, onAddProduct, showToast, scannerRef])

  /* ===============================
     Handlers input (ESTABLES)
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
        handleScan()
      }
    },
    [handleScan]
  )

  return (
    <>
      {/* ===============================
          Input invisible (scanner)
      =============================== */}
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

      {/* ===============================
          Toast
      =============================== */}
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