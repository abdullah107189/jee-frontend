export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-muted" />

      <div className="space-y-3 p-3 sm:p-4">
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />

        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />

        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />

        <div className="h-5 w-2/5 animate-pulse rounded bg-muted" />

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div className="h-9 animate-pulse rounded-xl bg-muted" />
          <div className="h-9 w-9 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
