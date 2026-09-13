import { Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";

interface EmptyProductsStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export default function EmptyProductsState({
  hasFilters,
  onReset,
}: EmptyProductsStateProps) {
  return (
    <Card className="rounded-2xl border-dashed border-border bg-card">
      <CardContent
        className="
          flex flex-col
          items-center justify-center
          px-5 py-16
          text-center
        "
      >
        <div
          className="
            flex h-14 w-14
            items-center justify-center
            rounded-2xl
            bg-muted
            text-muted-foreground
          "
        >
          <Search className="h-6 w-6" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-foreground">
          No products found
        </h2>

        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
          {hasFilters
            ? "Try changing your search or removing some filters."
            : "There are no products available right now."}
        </p>

        {hasFilters && (
          <Button
            onClick={onReset}
            className="mt-5 rounded-xl"
          >
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
