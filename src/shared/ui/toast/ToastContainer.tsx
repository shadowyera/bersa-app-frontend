import type { Toast } from './toast.types'

export function ToastContainer({
  toasts,
}: {
  toasts: Toast[]
}) {
  return (
    <div
      className="
        fixed
        top-6
        left-1/2
        -translate-x-1/2
        z-[9999]
        space-y-3
        pointer-events-none
      "
    >
      {toasts.map(t => {

        const variantStyles =
          t.type === 'success'
            ? 'border-success/40 text-success'
            : t.type === 'error'
            ? 'border-danger/40 text-danger'
            : t.type === 'warning'
            ? 'border-warning/40 text-warning'
            : 'border-border text-foreground'

        return (
          <div
            key={t.id}
            className={`
              min-w-[260px]
              max-w-[420px]
              rounded-xl
              bg-surface
              border
              px-5
              py-3
              text-sm
              font-medium
              shadow-lg
              backdrop-blur-sm
              transition-all
              duration-200
              ${variantStyles}
            `}
          >
            {t.message}
          </div>
        )
      })}
    </div>
  )
}