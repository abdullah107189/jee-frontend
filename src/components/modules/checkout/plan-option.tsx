import { cn } from "@/lib/utils";

interface PlanOptionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
  onSelect: () => void;
}

export function PlanOption({
  title,
  description,
  icon: Icon,
  selected,
  onSelect,
}: PlanOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-accent",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", selected && "text-primary")}>
          {title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <div
        className={cn(
          "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary" : "border-border",
        )}
      >
        {selected && <span className="block h-2 w-2 rounded-full bg-primary" />}
      </div>
    </button>
  );
}