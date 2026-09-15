import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
type Props = {
  specifications?: Record<string, unknown> | null; // ✅ unknown for flexible values
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Convert camelCase / snake_case / PascalCase key to readable label.
 * Examples:
 *   "capType"       → "Cap Type"
 *   "AC_voltage"    → "AC Voltage"
 *   "wattage"       → "Wattage"
 */
function toLabel(key: string): string {
  return (
    key
      // insert space before capital letters
      .replace(/([A-Z])/g, " $1")
      // replace underscores/hyphens with spaces
      .replace(/[_-]+/g, " ")
      // trim & collapse whitespace
      .trim()
      .replace(/\s+/g, " ")
      // capitalize each word
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/**
 * Convert any spec value to a display-friendly string.
 * Handles: string, number, boolean, null, array, object.
 */
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
    ([, value]) => value !== null && value !== undefined,
  );

  if (entries.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specifications</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {entries.map(([key, value], index) => (
            <div
              key={key}
              className={`grid grid-cols-1 gap-1 px-4 py-3 text-sm sm:grid-cols-[40%_1fr] sm:gap-4 sm:px-6 sm:py-4 ${
                index % 2 === 1 ? "bg-muted/30" : ""
              }`}
            >
              <span className="font-medium text-foreground/90">
                {toLabel(key)}
              </span>

              <span className="break-words text-muted-foreground">
                {toDisplayValue(value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
