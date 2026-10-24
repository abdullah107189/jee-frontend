"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import MainProductCard from "@/components/shared/productCard/MainProductCard";
import { PriceRangeSection } from "@/components/modules/products/filters/PriceRangeSection";
import type { ProductCardData } from "@/lib/types/product.types";
import { ProductPagination } from "../../products/catalog/ProductPagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ─────────── Types ─────────── */
type FilterOption = { id: string; value: string };
type FilterGroup = {
  name: string;
  slug: string;
  type: string;
  options: FilterOption[];
};

interface Props {
  products: ProductCardData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categorySlug: string;
  filters: FilterGroup[];
  lowestPrice: number;
  highestPrice: number;
  initialFilters: {
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    warrantyMonths?: string;
    sort?: string;
    filter: Record<string, string>;
  };
}

/* ─────────── Main ─────────── */
export function ProductListingClient({
  products,
  total,
  page,
  totalPages,
  filters,
  lowestPrice,
  highestPrice,
  initialFilters,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  /* only filter groups with options */
  const usableFilters = filters.filter((f) => f.options.length > 0);

  const activeCount =
    (initialFilters.brand ? initialFilters.brand.split(",").length : 0) +
    Object.keys(initialFilters.filter).length +
    (initialFilters.minPrice ? 1 : 0) +
    (initialFilters.maxPrice ? 1 : 0);

  const updateURL = (updater: (sp: URLSearchParams) => void) => {
    const sp = new URLSearchParams(searchParams.toString());
    updater(sp);
    sp.delete("page"); // reset page on filter change
    router.push(`${pathname}?${sp.toString()}`);
  };

  const toggleFilter = (slug: string, value: string) => {
    updateURL((sp) => {
      const existing = sp.get(slug)?.split(",") ?? [];
      const next = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];
      if (next.length) sp.set(slug, next.join(","));
      else sp.delete(slug);
    });
  };

  const clearAll = () => router.push(pathname);

  const goToPage = (p: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(p));
    router.push(`${pathname}?${sp.toString()}`);
  };
  const handleSort = (value: string) => {
    updateURL((sp) => {
      if (value === "popular") sp.delete("sortBy");
      else sp.set("sortBy", value);  // ← sortBy (not sort)
    });
  };

  const handlePrice = (range: [number, number]) => {
    updateURL((sp) => {
      if (range[0] > lowestPrice) sp.set("minPrice", String(range[0]));
      else sp.delete("minPrice");

      if (range[1] < highestPrice) sp.set("maxPrice", String(range[1]));
      else sp.delete("maxPrice");
    });
  };

  const priceRange: [number, number] = [
    initialFilters.minPrice ? Number(initialFilters.minPrice) : lowestPrice,
    initialFilters.maxPrice ? Number(initialFilters.maxPrice) : highestPrice,
  ];

  return (
    <div className="flex flex-col gap-5 mt-5 lg:flex-row lg:gap-8 ">
      {/* ─── Desktop Sidebar (sticky, always visible) ─── */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0">
        <div className="sticky top-20">
          <FilterSidebar
            filters={usableFilters}
            initialFilters={initialFilters}
            activeCount={activeCount}
            priceRange={priceRange}
            lowestPrice={lowestPrice}
            highestPrice={highestPrice}
            onToggle={toggleFilter}
            onClear={clearAll}
            onPriceChange={handlePrice}
          />
        </div>
      </aside>

      {/* ─── Mobile Filter Drawer ─── */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-4 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilter(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <FilterSidebar
              filters={usableFilters}
              initialFilters={initialFilters}
              activeCount={activeCount}
              priceRange={priceRange}
              lowestPrice={lowestPrice}
              highestPrice={highestPrice}
              onToggle={toggleFilter}
              onClear={clearAll}
              onPriceChange={handlePrice}
            />

            <Button
              className="mt-4 w-full"
              onClick={() => setShowMobileFilter(false)}
            >
              Show {total} products
            </Button>
          </div>
        </div>
      )}

      {/* ─── Main content ─── */}
      <section className="min-w-0 flex-1">
        {/* Toolbar */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="gap-2 lg:hidden"
            onClick={() => setShowMobileFilter(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>

          <p className="hidden text-sm text-muted-foreground sm:block font-medium">
            {total} {total === 1 ? "product" : "products"}
          </p>

          <Select
            value={initialFilters.sort ?? "popular"}
            onValueChange={handleSort}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              No products match your filters.
            </p>
            <Button variant="outline" className="mt-4" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <MainProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <ProductPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </section>
    </div>
  );
}

/* ─────────── Filter Sidebar ─────────── */
function FilterSidebar({
  filters,
  initialFilters,
  activeCount,
  priceRange,
  lowestPrice,
  highestPrice,
  onToggle,
  onClear,
  onPriceChange,
}: {
  filters: FilterGroup[];
  initialFilters: Props["initialFilters"];
  activeCount: number;
  priceRange: [number, number];
  lowestPrice: number;
  highestPrice: number;
  onToggle: (slug: string, value: string) => void;
  onClear: () => void;
  onPriceChange: (range: [number, number]) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Filters {activeCount > 0 && `(${activeCount})`}
        </h2>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Price */}
      <section className="border-t border-border pt-5">
        <h3 className="mb-3 text-sm font-semibold">Price</h3>
        <PriceRangeSection
          priceRange={priceRange}
          maxPrice={highestPrice}
          onPriceChange={onPriceChange}
          debounceMs={500}
        />
      </section>

      {/* Dynamic groups */}
      {filters.map((group) => {
        const current = initialFilters.filter[group.slug]?.split(",") ?? [];
        const brandCurrent =
          group.slug === "brand" ? initialFilters.brand?.split(",") ?? [] : [];
        const selected = group.slug === "brand" ? brandCurrent : current;

        return (
          <section key={group.slug} className="border-t border-border pt-5">
            <h3 className="mb-3 text-sm font-semibold">{group.name}</h3>
            <div className="flex flex-col gap-2.5">
              {group.options.map((opt) => {
                const checked = selected.includes(opt.value);
                return (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-2.5 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => onToggle(group.slug, opt.value)}
                    />
                    <span
                      className={
                        checked ? "font-medium" : "text-muted-foreground"
                      }
                    >
                      {opt.value}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Empty state (0 products) */}
      {filters.length === 0 && (
        <p className="border-t border-border pt-5 text-xs text-muted-foreground">
          No filters for this category yet.
        </p>
      )}
    </div>
  );
}