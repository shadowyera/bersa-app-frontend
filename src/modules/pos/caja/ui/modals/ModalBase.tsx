import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalBaseProps {
  title: string
  children: ReactNode
  onClose?: () => void
  footer?: ReactNode
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
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
  }[maxWidth]

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="
          absolute inset-0
          bg-background/80
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full mx-4
          ${maxWidthClass}
          rounded-2xl
          bg-surface text-foreground
          border border-border
          shadow-xl
          flex flex-col
          max-h-[90vh]
        `}
      >

        {/* Header */}
        <div className="
          px-6 py-4
          border-b border-border
          flex items-center justify-between
          bg-background/40
          rounded-t-2xl
        ">
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          {onClose && (
            <button
              onClick={onClose}
              className="
                text-muted-foreground
                hover:text-foreground
                transition-colors
              "
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="
            px-6 py-4
            border-t border-border
            bg-background/30
            rounded-b-2xl
          ">
            {footer}
          </div>
        )}

      </div>

    </div>,
    document.body
  )
}