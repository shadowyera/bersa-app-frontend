import * as React from 'react'
import clsx from 'clsx'

/* =====================================================
   Input – Base del sistema
   - Usa tokens (surface, border, foreground)
   - Focus consistente
   - Soporta error
   - Sin conflicto con size nativo HTML
===================================================== */

type InputSize =
  | 'sm'
  | 'md'
  | 'lg'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize
  error?: boolean
}

/* =====================================================
   Estilos base
===================================================== */

const base =
  'w-full rounded-lg border border-border bg-surface text-foreground ' +
  'placeholder:text-foreground/50 ' +
  'transition-all duration-150 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

const sizes: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-sm',
}

export const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(function Input(
  {
    className,
    inputSize = 'md',
    error = false,
    type = 'text',
    ...props
  },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={clsx(
        base,
        sizes[inputSize],
        error &&
          'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40',
        className
      )}
      {...props}
    />
  )
})