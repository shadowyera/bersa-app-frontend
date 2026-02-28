import * as React from "react"
import { cn } from "../utils/cn"

interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function SectionHeader({
  title,
  subtitle,
  actions,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mb-4",
        className
      )}
      {...props}
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-foreground/60">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}