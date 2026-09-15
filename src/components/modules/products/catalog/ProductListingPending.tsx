import { Loader2 } from "lucide-react";

export function ProductListingPending() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-12 backdrop-blur-[2px]">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-lg">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="font-medium">Updating results...</span>
      </div>
    </div>
  );
}