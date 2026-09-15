import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------------------------------------------------- */
/* Grid Skeleton — matches MainProductCard layout                             */
/* -------------------------------------------------------------------------- */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* List Skeleton — matches HorizontalProductCard layout                        */
/* -------------------------------------------------------------------------- */
export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductHorizontalSkeleton key={i} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Single Grid Card Skeleton                                                  */
/* -------------------------------------------------------------------------- */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Image */}
      <Skeleton className="aspect-square w-full rounded-none" />

      {/* Content */}
      <div className="space-y-3 p-3 sm:p-4">
        {/* Warranty badge */}
        <Skeleton className="h-3 w-20" />

        {/* Title line 1 */}
        <Skeleton className="h-4 w-full" />
        {/* Title line 2 */}
        <Skeleton className="h-4 w-3/4" />

        {/* Price + Add button row */}
        <div className="flex items-end justify-between gap-2 pt-1">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-9 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Single Horizontal (List) Skeleton                                          */
/* -------------------------------------------------------------------------- */
export function ProductHorizontalSkeleton() {
  return (
    <div className="flex w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Image */}
      <Skeleton
        className="
          h-32 w-32 shrink-0 rounded-none
          sm:h-40 sm:w-40
          lg:h-44 lg:w-44
        "
      />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
        <div className="space-y-2">
          {/* Warranty */}
          <Skeleton className="h-3 w-24" />

          {/* Title */}
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Bottom row */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-9 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sidebar Filters Skeleton                                                   */
/* -------------------------------------------------------------------------- */
export function SidebarFiltersSkeleton() {
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-14 rounded-md" />
      </div>

      {/* Category section */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      {/* Brand section */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-16" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Price range section */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Warranty section */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Full Page Skeleton — sidebar + toolbar + grid                              */
/* Best for `app/products/loading.tsx`                                        */
/* -------------------------------------------------------------------------- */
export function ProductsPageSkeleton() {
  return (
    <main className="mxw">
      {/* Header */}
      <div className="mt-2 space-y-3">
        <Skeleton className="h-9 w-64 sm:h-10 sm:w-72" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-2/3 max-w-xl" />
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:mt-6 lg:flex-row lg:gap-8">
        {/* Sidebar skeleton — hidden on mobile */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <SidebarFiltersSkeleton />
        </aside>

        {/* Main content */}
        <section className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-10 w-full rounded-xl sm:max-w-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
          </div>

          {/* Count */}
          <Skeleton className="mb-4 h-4 w-40" />

          {/* Grid */}
          <ProductGridSkeleton />
        </section>
      </div>
    </main>
  );
}
