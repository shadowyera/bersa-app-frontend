import type { Categoria } from '@/shared/types/categoria.types'
import CategoriaForm from './CategoriaForm'

type Props = {
  open: boolean
  categoria: Categoria | null
  onClose: () => void
  onSaved: () => void
}

export default function CategoriaModal({
  open,
  categoria,
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
            {categoria ? 'Editar categoría' : 'Nueva categoría'}
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
          <CategoriaForm
            categoria={categoria}
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