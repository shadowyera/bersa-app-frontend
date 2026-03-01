import * as React from 'react'
import clsx from 'clsx'

type SelectSize =
  | 'sm'
  | 'md'
  | 'lg'

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  selectSize?: SelectSize
  error?: boolean
}

/* =====================================================
   Base
===================================================== */

const base =
  'w-full rounded-lg border border-border bg-surface text-foreground ' +
  'transition-all duration-150 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'appearance-none'

const sizes: Record<SelectSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-sm',
}

/* =====================================================
   Component
===================================================== */

export const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps
>(function Select(
  {
    className,
    selectSize = 'md',
    error = false,
    children,
    ...props
  },
  ref
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        className={clsx(
          base,
          sizes[selectSize],
          error &&
            'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40',
          'pr-8',
          className
        )}
        {...props}
      >
        {children}
      </select>

      {/* Flecha custom */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-foreground/50 text-xs">
        ▼
      </div>
    </div>
  )
})