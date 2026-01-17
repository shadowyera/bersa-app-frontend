import type { Proveedor } from '@/shared/types/proveedor.types'
import ProveedorForm from './ProveedorForm'

type Props = {
  open: boolean
  proveedor: Proveedor | null
  onClose: () => void
  onSaved: () => void
}

export default function ProveedorModal({
  open,
  proveedor,
  onClose,
  onSaved,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg bg-slate-900 border border-slate-800 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-semibold">
            {proveedor
              ? 'Editar proveedor'
              : 'Nuevo proveedor'}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <ProveedorForm
            proveedor={proveedor}
            onSaved={() => {
              onSaved()
              onClose()
            }}
          />
        </div>
      </div>
    </div>
  )
}