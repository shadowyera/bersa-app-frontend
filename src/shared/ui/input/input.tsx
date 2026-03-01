import * as React from 'react'
import clsx from 'clsx'

type InputSize =
  | 'sm'
  | 'md'
  | 'lg'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize
  error?: boolean
}

const base =
  'w-full rounded-lg border border-border bg-surface text-foreground ' +
  'placeholder:text-muted-foreground ' +
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
          'border-danger focus-visible:border-danger focus-visible:ring-danger/40',
        className
      )}
      {...props}
    />
  )
})