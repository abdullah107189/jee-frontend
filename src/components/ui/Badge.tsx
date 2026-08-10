import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'destructive' | 'outline';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold transition-colors focus:outline-none",
        {
          "bg-blue-100 text-blue-700": variant === "default",
          "bg-green-100 text-green-700": variant === "success",
          "bg-red-100 text-red-700": variant === "destructive",
          "border-2 border-slate-200 text-slate-700": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
