import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalBaseProps {
  title: string
  children: ReactNode
  onClose?: () => void
  footer?: ReactNode

  /**
   * Controla ancho máximo del modal
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export default function ModalBase({
  title,
  children,
  onClose,
  footer,
  maxWidth = 'sm',
}: ModalBaseProps) {

  const maxWidthClass = {
    sm: 'max-w-md',   // dialogs pequeños
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-4xl',  // 🔥 ideal para resumen
    '2xl': 'max-w-5xl',
  }[maxWidth]

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full mx-4
          ${maxWidthClass}
          rounded-2xl
          bg-slate-900 text-slate-100
          border border-slate-700 shadow-2xl
        `}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between">
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200"
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