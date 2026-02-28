import * as React from 'react'
import clsx from 'clsx'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({
  className,
  ...props
}: LabelProps) {
  return (
    <label
      className={clsx(
        'text-xs font-medium text-foreground/70',
        className
      )}
      {...props}
    />
  )
}