export function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-muted lg:col-span-1" />
    </div>
  );
}