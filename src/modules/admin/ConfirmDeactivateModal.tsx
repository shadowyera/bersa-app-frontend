type Props = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  loading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDeactivateModal({
  open,
  title,
  description,
  confirmLabel,
  loading = false,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null

  const isReactivate = confirmLabel === 'Reactivar'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-lg bg-slate-900 border border-slate-800 shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800">
          <h2
            className={`text-lg font-semibold ${
              isReactivate ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {title}
          </h2>
        </div>

        {/* Body */}
        <div className="p-4 text-sm text-slate-300">
          {description}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-4 py-3 border-t border-slate-800">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded text-white disabled:opacity-50 ${
              isReactivate
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Procesando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}