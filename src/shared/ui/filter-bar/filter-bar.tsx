import * as React from "react"
import { cn } from "../utils/cn"

export interface FilterBarProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function FilterBar({
  className,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        "pb-4",
        className
      )}
      {...props}
    />
  )
}