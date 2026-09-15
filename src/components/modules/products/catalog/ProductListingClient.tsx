"use client";

import { useCallback, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import type { Brand, Category } from "@/lib/fixtures/product/types";
import type { ProductCardData } from "@/lib/types/product.types";
import { MobileFilterDrawer } from "../filters/MobileFilterDrawer";
import { ProductGrid } from "./ProductGrid";
import { ProductList } from "./ProductList";
import { ProductListingHeader } from "./ProductListingHeader";
import { ProductListingToolbar } from "./ProductListingToolbar";
import { ProductListingEmpty } from "./ProductListingEmpty";
import { ProductListingPending } from "./ProductListingPending";
import { ProductPagination } from "./ProductPagination";
import { SidebarFilters } from "../filters/SidebarFilters";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
export type SortOption = "popular" | "price-asc" | "price-desc" | "newest";
export type ViewMode = "grid" | "list";

export interface InitialFilters {
  search: string;
  categoryId: string | null;
  brandIds: string[];
  priceRange: [number, number];
  sort: SortOption;
}

interface ProductListingClientProps {
  products: ProductCardData[];
  categories: Category[];
  brands: Brand[];
  total: number;
  page: number;
  limit: number;
  initialFilters: InitialFilters;
}

const MAX_PRICE = 1_000_000;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
function countActiveFilters(filters: InitialFilters): number {
  return (
    (filters.categoryId ? 1 : 0) +
    filters.brandIds.length +
    (filters.priceRange[0] > 0 ? 1 : 0) +
    (filters.priceRange[1] < MAX_PRICE ? 1 : 0)
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export default function ProductListingClient({
  products,
  categories,
  brands,
  total,
  page,
  limit,
  initialFilters,
}: ProductListingClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters.search);

  /* ---------------- URL sync ---------------- */
  const updateURL = useCallback(
    (updates: Record<string, string | null>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });

      if (resetPage) params.set("page", "1");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    },
    [router, pathname, searchParams],
  );

  /* ---------------- Handlers ---------------- */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: searchInput.trim() || null });
  };

  const handleCategoryChange = (categoryId: string | null) => {
    updateURL({ category: categoryId });
    setShowFilters(false);
  };

  const handleBrandChange = (brandId: string) => {
    const current = initialFilters.brandIds;
    const next = current.includes(brandId)
      ? current.filter((id) => id !== brandId)
      : [...current, brandId];
    updateURL({ brands: next.length ? next.join(",") : null });
  };

  const handleWarrantyChange = (_period: string) => {
    // extend later
  };

  const handlePriceChange = (range: [number, number]) => {
    updateURL({
      minPrice: range[0] > 0 ? String(range[0]) : null,
      maxPrice: range[1] < MAX_PRICE ? String(range[1]) : null,
    });
  };

  const handleSortChange = (value: SortOption) => {
    updateURL({ sort: value === "popular" ? null : value });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === page || newPage < 1) return;

    updateURL({ page: newPage === 1 ? null : String(newPage) }, false);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddToCart = (product: ProductCardData) => {
    dispatch(
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.comparePrice ?? undefined,
        image: product.image ?? "/images/product-placeholder.png",
        warrantyMonths: product.warrantyMonths,
        brand: product.brandName ?? undefined,
        category: product.categoryName ?? undefined,
      }),
    );

    toast.success(`${product.name} added to cart`);
  };

  /* ---------------- Derived ---------------- */
  const activeFilterCount = countActiveFilters(initialFilters);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const sidebarFiltersProps = {
    filters: {
      categoryId: initialFilters.categoryId,
      brandIds: initialFilters.brandIds,
      warrantyPeriods: [],
      priceRange: initialFilters.priceRange,
    },
    categories,
    brands,
    onCategoryChange: handleCategoryChange,
    onBrandChange: handleBrandChange,
    onWarrantyChange: handleWarrantyChange,
    onPriceChange: handlePriceChange,
    onClearFilters: handleClearFilters,
  };

  /* ---------------- Render ---------------- */
  return (
    <main className="mxw">
      <ProductListingHeader />

      <div className="mt-5 flex flex-col gap-5 sm:mt-8 lg:flex-row lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <SidebarFilters {...sidebarFiltersProps} />
        </aside>

        {/* Mobile drawer */}
        {showFilters && (
          <MobileFilterDrawer
            total={total}
            onClose={() => setShowFilters(false)}
            sidebarFiltersProps={sidebarFiltersProps}
          />
        )}

        {/* Main */}
        <section className="mb-5 min-w-0 flex-1">
          <ProductListingToolbar
            searchInput={searchInput}
            onSearchInput={setSearchInput}
            onSearch={handleSearch}
            onClearSearch={() => setSearchInput("")}
            sort={initialFilters.sort}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onToggleView={() =>
              setViewMode((m) => (m === "grid" ? "list" : "grid"))
            }
            onOpenFilters={() => setShowFilters(true)}
            activeFilterCount={activeFilterCount}
          />

          <p className="mb-4 text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{total}</span>{" "}
            products
          </p>

          <div className="relative">
            {isPending && <ProductListingPending />}

            {products.length === 0 ? (
              <ProductListingEmpty onClear={handleClearFilters} />
            ) : (
              <>
                {viewMode === "grid" ? (
                  <ProductGrid
                    products={products}
                    onAddToCart={handleAddToCart}
                  />
                ) : (
                  <ProductList
                    products={products}
                    onAddToCart={handleAddToCart}
                  />
                )}

                {totalPages > 1 && (
                  <ProductPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isPending={isPending}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
