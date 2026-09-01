export default function ProductCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card">
      {/* Image */}
      <div className="aspect-square animate-pulse bg-muted" />

      {/* Content */}
      <div className="space-y-3 p-3 sm:p-4">
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />

        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />

        <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
