import { cn } from "@/lib/utils";

interface SummaryRowProps {
  label: string;
  value: number;
  tone?: "default" | "primary";
}

export function SummaryRow({ label, value, tone }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-medium tabular-nums",
          tone === "primary" && "text-primary",
        )}
      >
        ৳{value.toLocaleString()}
      </span>
    </div>
  );
}