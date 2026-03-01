import * as React from 'react'
import { cn } from '../utils/cn'

interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
}

export function Surface({
  className,
  variant = 'default',
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        `
        bg-surface
        text-foreground
        border border-border
        rounded-xl
        `,
        variant === 'elevated' &&
          'shadow-xl shadow-black/20',
        className
      )}
      {...props}
    />
  )
}