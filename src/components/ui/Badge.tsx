import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'destructive' | 'outline' | 'warning';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold transition-colors focus:outline-none",
        {
          "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 dark:border dark:border-blue-800": variant === "default",
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border dark:border-emerald-800": variant === "success",
          "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 dark:border dark:border-rose-800": variant === "destructive",
          "border border-border text-foreground bg-transparent": variant === "outline",
          "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 dark:border dark:border-amber-800": variant === "warning",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
