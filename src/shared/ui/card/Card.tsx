import { forwardRef } from "react"
import type { HTMLAttributes } from "react"
import { cn } from "../utils/cn"

interface CardProps extends HTMLAttributes<HTMLDivElement> { }

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-surface",
                    "border border-border",
                    "rounded-xl",
                    "transition-colors duration-150 ease-out",
                    className
                )}
                {...props}
            />
        )
    }
)

Card.displayName = "Card"

interface CardInteractiveProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export const CardInteractive = forwardRef<
  HTMLButtonElement,
  CardInteractiveProps
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "bg-surface",
        "border border-border",
        "rounded-xl",
        "text-left",
        "transition-all duration-150 ease-out",
        "hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
        "hover:border-primary/30",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/40",
        "active:scale-[0.995]",
        className
      )}
      {...props}
    />
  )
})

CardInteractive.displayName = "CardInteractive"