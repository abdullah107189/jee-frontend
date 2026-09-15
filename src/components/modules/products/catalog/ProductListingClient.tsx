"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import HorizontalProductCard from "@/components/shared/productCard/HorizontalProductCard";
import MainProductCard from "../MainProductCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SidebarFilters } from "../SidebarFilters";

import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import type { Brand, Category } from "@/lib/fixtures/product/types";
import { ProductCardData } from "@/lib/types/product.types";

/* --------------------------- Types --------------------------- */
type ViewMode = "grid" | "list";
type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

interface InitialFilters {
  search: string;
  categoryId: string | null;
  brandIds: string[];
  priceRange: [number, number];
  sort: SortOption;
}

interface Props {
  products: ProductCardData[];
  categories: Category[];
  brands: Brand[];
  total: number;
  initialFilters: InitialFilters;
}

const MAX_PRICE = 1_000_000;

/* ------------------------- Component ------------------------- */
export default function ProductListingClient({
  products,
  categories,
  brands,
  total,
  initialFilters,
}: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /* -------------------- Local UI state -------------------- */
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters.search);

  /* ---------------- URL Update Helper ---------------- */
  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    },
    [router, pathname, searchParams],
  );

  /* -------------------- Filter Handlers -------------------- */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: searchInput.trim() || null, page: "1" });
  };

  const handleCategoryChange = (categoryId: string | null) => {
    updateURL({ category: categoryId, page: "1" });
    setShowFilters(false);
  };

  const handleBrandChange = (brandId: string) => {
    const current = initialFilters.brandIds;
    const next = current.includes(brandId)
      ? current.filter((id) => id !== brandId)
      : [...current, brandId];
    updateURL({ brands: next.length ? next.join(",") : null, page: "1" });
  };

  const handleWarrantyChange = (_period: string) => {
    // Extend later: warranty as CSV in URL
  };

  const handlePriceChange = (range: [number, number]) => {
    updateURL({
      minPrice: range[0] > 0 ? String(range[0]) : null,
      maxPrice: range[1] < MAX_PRICE ? String(range[1]) : null,
      page: "1",
    });
  };

  const handleSortChange = (value: SortOption) => {
    updateURL({ sort: value, page: "1" });
  };

  const clearFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  /* -------------------- Add to Cart -------------------- */

  const handleAddToCart = (product: ProductCardData) => {
    if (!product) {
      toast.error("Product not found");
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.comparePrice ?? undefined,
        image: product?.image ?? "/images/product-placeholder.png",
        warrantyMonths: product.warrantyMonths,
        brand: product.brandName ?? undefined,
        category: product.categoryName ?? undefined,
      }),
    );

    toast.success(`${product.name} added to cart`);
  };

  /* -------------------- Filter Count -------------------- */
  const activeFilterCount =
    (initialFilters.categoryId ? 1 : 0) +
    initialFilters.brandIds.length +
    (initialFilters.priceRange[0] > 0 ? 1 : 0) +
    (initialFilters.priceRange[1] < MAX_PRICE ? 1 : 0);

  /* ------------------------- Render ------------------------- */
  return (
    <main className="mxw">
      {/* ==================== Header ==================== */}
      <header className="mt-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          All Products
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Browse our premium collection of fans, electronics, and home
          appliances with guaranteed warranty.
        </p>
      </header>

      <div className="mt-5 flex flex-col gap-5 sm:mt-6 lg:flex-row lg:gap-8">
        {/* ==================== Desktop Sidebar ==================== */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <SidebarFilters
            filters={{
              categoryId: initialFilters.categoryId,
              brandIds: initialFilters.brandIds,
              warrantyPeriods: [],
              priceRange: initialFilters.priceRange,
            }}
            categories={categories}
            brands={brands}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onWarrantyChange={handleWarrantyChange}
            onPriceChange={handlePriceChange}
            onClearFilters={clearFilters}
          />
        </aside>

        {/* ==================== Mobile Filters Drawer ==================== */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-4 shadow-2xl">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />

              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <SidebarFilters
                filters={{
                  categoryId: initialFilters.categoryId,
                  brandIds: initialFilters.brandIds,
                  warrantyPeriods: [],
                  priceRange: initialFilters.priceRange,
                }}
                categories={categories}
                brands={brands}
                onCategoryChange={handleCategoryChange}
                onBrandChange={handleBrandChange}
                onWarrantyChange={handleWarrantyChange}
                onPriceChange={handlePriceChange}
                onClearFilters={clearFilters}
              />

              <Button
                type="button"
                onClick={() => setShowFilters(false)}
                className="mt-4 w-full"
              >
                Show {total} products
              </Button>
            </div>
          </div>
        )}

        {/* ==================== Main Content ==================== */}
        <section className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="pl-10 pr-10"
                aria-label="Search products"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Toggle */}
              <Button
                type="button"
                variant="outline"
                className="gap-2 lg:hidden"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* Sort */}
              <select
                value={initialFilters.sort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                aria-label="Sort products"
              >
                <option value="popular">Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>

              {/* View Toggle */}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setViewMode((m) => (m === "grid" ? "list" : "grid"))
                }
                aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
              >
                {viewMode === "grid" ? "List" : "Grid"}
              </Button>
            </div>
          </div>

          {/* Count */}
          <p className="mb-4 text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{total}</span>{" "}
            products
          </p>

          {/* Products container with pending overlay */}
          <div className="relative">
            {isPending && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-12 backdrop-blur-[2px]">
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="font-medium">Updating results...</span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <h2 className="text-lg font-bold">No products found</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or search.
                </p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
                {products.map((item) => (
                  <MainProductCard
                    key={item.id}
                    product={item}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products.map((item) => (
                  <HorizontalProductCard
                    key={item.id}
                    product={item}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
