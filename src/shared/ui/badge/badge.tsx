import * as React from "react"
import clsx from "clsx"

type Variant =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "outline"

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const base =
  "inline-flex items-center justify-center " +
  "rounded-md px-2 py-0.5 text-xs font-medium " +
  "transition-colors"

const variants: Record<Variant, string> = {
  default:
    "bg-surface text-foreground border border-border",

  success:
    "bg-success/10 text-success",

  danger:
    "bg-danger/10 text-danger",

  warning:
    "bg-warning/10 text-warning",

  info:
    "bg-info/10 text-info",

  outline:
    "border border-border text-foreground",
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        base,
        variants[variant],
        className
      )}
      {...props}
    />
  )
}