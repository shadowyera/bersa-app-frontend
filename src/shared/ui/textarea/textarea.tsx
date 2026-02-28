import * as React from "react"
import clsx from "clsx"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const base =
  "w-full rounded-lg border border-border bg-surface text-foreground " +
  "placeholder:text-foreground/50 " +
  "transition-all duration-150 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary " +
  "disabled:opacity-50 disabled:cursor-not-allowed"

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function Textarea(
  { className, error = false, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        base,
        "min-h-[100px] p-3 text-sm resize-none",
        error &&
          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40",
        className
      )}
      {...props}
    />
  )
})