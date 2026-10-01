import { Button } from "@/components/ui/Button";

interface ProductListingEmptyProps {
  onClear: () => void;
}

export function ProductListingEmpty({ onClear }: ProductListingEmptyProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
      <h2 className="text-lg font-bold">No products found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Try adjusting your filters or search.
      </p>
      <Button onClick={onClear} className="mt-4">
        Clear Filters
      </Button>
    </div>
  );
}