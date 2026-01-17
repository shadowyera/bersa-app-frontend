import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalBaseProps {
  title: string
  children: ReactNode
  onClose?: () => void
  footer?: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg'
}

/**
 * ModalBase PRO (con Portal)
 *
 * ✔ Renderiza en document.body
 * ✔ No lo afecta ningún layout
 * ✔ Z-index garantizado
 */
export default function ModalBase({
  title,
  children,
  onClose,
  footer,
  maxWidth = 'sm',
}: ModalBaseProps) {
  const maxWidthClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
  }[maxWidth]

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${maxWidthClass} mx-4 rounded-2xl bg-slate-900 text-slate-100 shadow-2xl border border-slate-700`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}