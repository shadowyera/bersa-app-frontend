import type { ReactNode } from 'react'
import { Button } from '@/shared/ui/button/button'
import { Surface } from '../surface/Surface'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">

      <Surface className="w-full max-w-md p-6 space-y-4 rounded-2xl">

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}

          {children}
        </div>

        <div className="flex justify-end gap-3 pt-2">

          <Button
            variant="outline"
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            variant={
              variant === 'danger'
                ? 'danger'
                : 'primary'
            }
            onClick={onConfirm}
          >
            {confirmText}
          </Button>

        </div>

      </Surface>
    </div>
  )
}