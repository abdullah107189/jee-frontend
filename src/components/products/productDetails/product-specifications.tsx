import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type Props = {
  specifications?: Record<string, string>;
};

export function ProductSpecifications({
  specifications,
}: Props) {
  if (!specifications) {
    return null;
  }

  const entries = Object.entries(specifications);

  if (!entries.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specifications</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-2 gap-4 px-6 py-4 text-sm"
            >
              <span className="font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </span>

              <span className="text-muted-foreground">
                {value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
