import * as React from 'react'
import clsx from 'clsx'

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'

type Size =
  | 'sm'
  | 'md'
  | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const base =
  'inline-flex items-center justify-center rounded-lg font-medium ' +
  'transition-all duration-150 ease-out select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ' +
  'disabled:opacity-50 disabled:pointer-events-none'

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-sm',
}

const variants: Record<Variant, string> = {

  primary:
    'bg-primary text-primary-foreground ' +
    'hover:opacity-90 active:scale-[0.98]',

  secondary:
    'bg-surface text-foreground border border-border ' +
    'hover:border-primary/40 active:scale-[0.98]',

  outline:
    'bg-transparent border border-border text-foreground ' +
    'hover:border-primary/40 hover:bg-surface/60 active:scale-[0.98]',

  ghost:
    'bg-transparent text-foreground ' +
    'hover:bg-surface/60 active:scale-[0.98]',

  danger:
    'bg-danger text-danger-foreground ' +
    'hover:bg-danger/90 active:scale-[0.98]',

  success:
    'bg-success text-success-foreground ' +
    'hover:bg-success/90 active:scale-[0.98]',
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        base,
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    />
  )
})