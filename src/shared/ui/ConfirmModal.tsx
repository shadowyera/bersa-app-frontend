import { useEscapeKey } from '@/shared/hooks/useEscapeKey'

interface Props {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: Props) {

  /* =====================================================
     Cerrar con ESC
  ===================================================== */
  useEscapeKey(open, onCancel)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* OVERLAY */}
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* CARD */}
      <div
        className="
          relative
          w-full max-w-md
          bg-slate-800
          rounded-2xl
          shadow-2xl
          border border-slate-700
          overflow-hidden
          animate-[fadeIn_.12s_ease-out]
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-lg">
              ⚠
            </div>

            <h3 className="text-base font-semibold text-white">
              {title}
            </h3>
          </div>

          {/* BOTÓN X */}
          <button
            onClick={onCancel}
            className="
              w-8 h-8
              flex items-center justify-center
              rounded-md
              text-slate-400
              hover:text-white
              hover:bg-slate-700
              transition
            "
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="px-5 py-5">
          {description && (
            <p className="text-sm text-slate-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-slate-700 flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-md
              bg-slate-700 hover:bg-slate-600
              text-white
              transition
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-md
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              transition
            "
          >
            {confirmText}
          </button>

        </div>

      </div>
    </div>
  )
}