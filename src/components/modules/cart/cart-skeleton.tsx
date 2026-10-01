import Breadcrumb from "@/components/shared/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder for `/cart`. Rendered while the cart slice is not yet
 * hydrated (SSR + first client paint) to avoid any hydration mismatch / flash.
 */
export function CartSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading your cart">
      <Breadcrumb />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-28 rounded-full" />
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
        <section className="space-y-3 sm:space-y-4" aria-label="Cart items loading">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex gap-3 overflow-hidden rounded-xl border border-border/60 p-3 sm:gap-4 sm:p-4 lg:p-5"
            >
              <Skeleton className="h-20 w-20 shrink-0 rounded-lg sm:h-24 sm:w-24 lg:h-28 lg:w-28" />

              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-28" />

                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-8 w-28 rounded-lg" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside className="space-y-4" aria-label="Order summary loading">
          <Skeleton className="h-72 w-full rounded-xl" />
        </aside>
      </div>
    </div>
  );
}
