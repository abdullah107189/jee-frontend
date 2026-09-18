import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
type Props = {
  specifications?: Record<string, unknown> | null;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
function toLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toDisplayValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toLocaleString();
  if (Array.isArray(value)) return value.map(toDisplayValue).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function ProductSpecifications({ specifications }: Props) {
  if (!specifications) return null;

  const entries = Object.entries(specifications).filter(
    ([, v]) => v !== null && v !== undefined,
  );

  if (entries.length === 0) return null;

  return (
    <Card className="overflow-hidden rounded-xl">
      <CardHeader className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-base sm:text-lg">Specifications</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/*
         * Responsive strategy:
         *   - Mobile (<640px): stacked — label above value
         *   - Tablet+ (≥640px): two-column grid — 40% / 60%
         */}
        <dl className="divide-y divide-border">
          {entries.map(([key, value], index) => (
            <div
              key={key}
              className={`
                grid grid-cols-1 gap-1 px-4 py-3 text-sm
                sm:grid-cols-[minmax(140px,40%)_1fr] sm:gap-6 sm:px-6 sm:py-4
                ${index % 2 === 1 ? "bg-muted/30" : ""}
              `}
            >
              <dt className="font-medium text-foreground/90">{toLabel(key)}</dt>

              <dd className="wrap-break-word text-muted-foreground">
                {toDisplayValue(value)}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
