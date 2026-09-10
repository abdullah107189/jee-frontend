"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MainLayout } from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";

import ProductCard from "@/components/shared/productCard/ProductCard";
import HorizontalProductCard from "@/components/shared/productCard/HorizontalProductCard";

import {
  SidebarFilters,
  type ProductFilters,
  MAX_PRICE,
} from "@/components/products/SidebarFilters";

import { MOCK_PRODUCTS } from "@/lib/redux/features/product/mockData";

/* ================================================================
   TYPES
================================================================ */

type ViewMode = "grid" | "list";

type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating";

/* ================================================================
   SORT OPTIONS
================================================================ */

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "popular",
    label: "Popular",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
  },
  {
    value: "newest",
    label: "Newest First",
  },
  {
    value: "rating",
    label: "Top Rated",
  },
];

/* ================================================================
   DEFAULT FILTERS
================================================================ */

const DEFAULT_FILTERS: ProductFilters = {
  categoryId: null,
  brandIds: [],
  warrantyPeriods: [],
  priceRange: [0, MAX_PRICE],
};

/* ================================================================
   PAGE
================================================================ */

export default function ProductsPage() {
  /* ==============================================================
     STATE
  ============================================================== */

  const [viewMode, setViewMode] =
    useState<ViewMode>("grid");

  const [showFilters, setShowFilters] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState<SortOption>("popular");

  const [filters, setFilters] =
    useState<ProductFilters>(
      DEFAULT_FILTERS,
    );

  /* ==============================================================
     DATA SOURCE
     
     এখন MOCK_PRODUCTS ব্যবহার করছি।
     
     পরে API / Redux / Server data এ গেলে:
     
     const products = data?.products ?? [];
     
     শুধু এই জায়গাটা পরিবর্তন করলেই হবে।
  ============================================================== */

  const products = MOCK_PRODUCTS;

  /* ==============================================================
     FILTER HANDLERS
  ============================================================== */

  /**
   * Category
   */
  const handleCategoryChange = (
    categoryId: string | null,
  ) => {
    setFilters((current) => ({
      ...current,
      categoryId,
    }));
  };

  /**
   * Brand
   */
  const handleBrandChange = (
    brandId: string,
  ) => {
    setFilters((current) => {
      const alreadySelected =
        current.brandIds.includes(
          brandId,
        );

      return {
        ...current,

        brandIds: alreadySelected
          ? current.brandIds.filter(
              (id) => id !== brandId,
            )
          : [
              ...current.brandIds,
              brandId,
            ],
      };
    });
  };

  /**
   * Warranty
   */
  const handleWarrantyChange = (
    warranty: string,
  ) => {
    setFilters((current) => {
      const alreadySelected =
        current.warrantyPeriods.includes(
          warranty,
        );

      return {
        ...current,

        warrantyPeriods: alreadySelected
          ? current.warrantyPeriods.filter(
              (item) =>
                item !== warranty,
            )
          : [
              ...current.warrantyPeriods,
              warranty,
            ],
      };
    });
  };

  /**
   * Price
   */
  const handlePriceChange = (
    priceRange: [number, number],
  ) => {
    setFilters((current) => ({
      ...current,
      priceRange,
    }));
  };

  /**
   * Clear Filters
   */
  const handleClearFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      brandIds: [],
      warrantyPeriods: [],
    });
  };

  /* ==============================================================
     FILTERED + SORTED PRODUCTS
  ============================================================== */

  const visibleProducts = useMemo(() => {
    let result = [...products];

    /* ------------------------------------------------------------
       SEARCH
    ------------------------------------------------------------ */

    const query = search
      .trim()
      .toLowerCase();

    if (query) {
      result = result.filter((item) => {
        const product = item.product;

        const searchableText = [
          product.name,
          product.description,
          product.sku,
          product.brandId,
          product.categoryId,
          product.attributes?.color,
          product.attributes?.motorType,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          query,
        );
      });
    }

    /* ------------------------------------------------------------
       CATEGORY
    ------------------------------------------------------------ */

    if (filters.categoryId) {
      result = result.filter(
        (item) =>
          item.product.categoryId ===
          filters.categoryId,
      );
    }

    /* ------------------------------------------------------------
       BRAND
    ------------------------------------------------------------ */

    if (filters.brandIds.length > 0) {
      result = result.filter((item) =>
        filters.brandIds.includes(
          item?.product?.brandId || "",
        ),
      );
    }

    /* ------------------------------------------------------------
       PRICE
    ------------------------------------------------------------ */

    const [minPrice, maxPrice] =
      filters.priceRange;

    result = result.filter((item) => {
      const price = item.product.price;

      return (
        price >= minPrice &&
        price <= maxPrice
      );
    });

    /* ------------------------------------------------------------
       WARRANTY
    ------------------------------------------------------------ */

    if (
      filters.warrantyPeriods.length >
      0
    ) {
      result = result.filter((item) => {
        const months =
          item.product.warrantyMonths;

        return filters.warrantyPeriods.some(
          (warranty) => {
            switch (warranty) {
              case "1 Year":
                return (
                  months >= 12 &&
                  months < 24
                );

              case "2 Years":
                return (
                  months >= 24 &&
                  months < 60
                );

              case "5 Years":
                return (
                  months >= 60 &&
                  months < 120
                );

              case "10 Years":
                return months >= 120;

              default:
                return false;
            }
          },
        );
      });
    }

    /* ------------------------------------------------------------
       SORT
    ------------------------------------------------------------ */

    switch (sortBy) {
      case "price-asc":
        result.sort(
          (a, b) =>
            a.product.price -
            b.product.price,
        );
        break;

      case "price-desc":
        result.sort(
          (a, b) =>
            b.product.price -
            a.product.price,
        );
        break;

      case "newest":
        result.sort(
          (a, b) =>
            new Date(
              b.product.createdAt,
            ).getTime() -
            new Date(
              a.product.createdAt,
            ).getTime(),
        );
        break;

      case "rating":
        /**
         * তোমার current ProductItem-এ rating নেই।
         *
         * তাই আপাতত original order থাকবে।
         *
         * পরে যদি rating যোগ করো:
         *
         * result.sort(
         *   (a, b) =>
         *     (b.product.rating ?? 0) -
         *     (a.product.rating ?? 0)
         * );
         */
        break;

      case "popular":
      default:
        /**
         * Mock data-এর original order.
         */
        break;
    }

    return result;
  }, [
    products,
    search,
    filters,
    sortBy,
  ]);

  /* ==============================================================
     ACTIVE FILTER COUNT
  ============================================================== */

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.categoryId) {
      count += 1;
    }

    count += filters.brandIds.length;

    count +=
      filters.warrantyPeriods.length;

    if (filters.priceRange[0] > 0) {
      count += 1;
    }

    if (
      filters.priceRange[1] <
      MAX_PRICE
    ) {
      count += 1;
    }

    return count;
  }, [filters]);

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <MainLayout>
      <main className="mxw">
        {/* ======================================================
            BREADCRUMB
        ====================================================== */}

        <Breadcrumb />

        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="mt-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            All Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Browse our premium collection of
            fans, electronics, and home
            appliances with guaranteed
            warranty.
          </p>
        </header>

        {/* ======================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="mt-5 flex flex-col gap-5 sm:mt-6 sm:gap-6 lg:mt-8 lg:flex-row lg:gap-8">
          {/* ====================================================
              DESKTOP SIDEBAR
          ==================================================== */}

          <aside className="hidden lg:block">
            <SidebarFilters
              filters={filters}
              onCategoryChange={
                handleCategoryChange
              }
              onBrandChange={
                handleBrandChange
              }
              onWarrantyChange={
                handleWarrantyChange
              }
              onPriceChange={
                handlePriceChange
              }
              onClearFilters={
                handleClearFilters
              }
            />
          </aside>

          {/* ====================================================
              PRODUCTS SECTION
          ==================================================== */}

          <section className="min-w-0 flex-1">
            {/* ==================================================
                MOBILE / TABLET TOOLBAR
            ================================================== */}

            <div className="lg:hidden">
              {/* Search */}
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search in products..."
                  className="h-11 rounded-xl pl-10 pr-10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Toolbar */}
              <div className="mt-3 flex items-center gap-2">
                {/* Filters */}
                <Button
                  type="button"
                  variant="outline"
                  className="relative h-10 flex-1 gap-2 rounded-xl"
                  onClick={() =>
                    setShowFilters(
                      (previous) =>
                        !previous,
                    )
                  }
                  aria-expanded={
                    showFilters
                  }
                >
                  <SlidersHorizontal className="h-4 w-4" />

                  <span>Filters</span>

                  {activeFilterCount >
                    0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {/* Sort */}
                <Select
                  value={sortBy}
                  onValueChange={(
                    value,
                  ) =>
                    setSortBy(
                      value as SortOption,
                    )
                  }
                >
                  <SelectTrigger className="h-10 flex-1 rounded-xl">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>

                  <SelectContent>
                    {SORT_OPTIONS.map(
                      (option) => (
                        <SelectItem
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>

                {/* View Switch */}
                <ViewSwitcher
                  viewMode={
                    viewMode
                  }
                  onChange={
                    setViewMode
                  }
                />
              </div>

              {/* =================================================
                  MOBILE FILTER PANEL
              ================================================= */}

              {showFilters && (
                <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
                  <SidebarFilters
                    filters={filters}
                    onCategoryChange={
                      handleCategoryChange
                    }
                    onBrandChange={
                      handleBrandChange
                    }
                    onWarrantyChange={
                      handleWarrantyChange
                    }
                    onPriceChange={
                      handlePriceChange
                    }
                    onClearFilters={
                      handleClearFilters
                    }
                  />
                </div>
              )}

              {/* Count */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {
                      visibleProducts.length
                    }
                  </span>{" "}
                  products
                </p>

                {activeFilterCount >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      handleClearFilters
                    }
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* ==================================================
                DESKTOP TOOLBAR
            ================================================== */}

            <div className="hidden lg:flex lg:items-center lg:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search in products..."
                  className="pl-10 pr-10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Count */}
              <p className="shrink-0 text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {
                    visibleProducts.length
                  }
                </span>{" "}
                products
              </p>

              {/* View + Sort */}
              <div className="flex shrink-0 items-center gap-2">
                <ViewSwitcher
                  viewMode={
                    viewMode
                  }
                  onChange={
                    setViewMode
                  }
                />

                <Select
                  value={sortBy}
                  onValueChange={(
                    value,
                  ) =>
                    setSortBy(
                      value as SortOption,
                    )
                  }
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>

                  <SelectContent>
                    {SORT_OPTIONS.map(
                      (option) => (
                        <SelectItem
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ==================================================
                ACTIVE FILTER SUMMARY
            ================================================== */}

            {activeFilterCount > 0 && (
              <ActiveFilterSummary
                filters={filters}
                onClear={
                  handleClearFilters
                }
              />
            )}

            {/* ==================================================
                PRODUCT RESULT
            ================================================== */}

            {visibleProducts.length >
            0 ? (
              <>
                {/* ==============================================
                    GRID VIEW
                ============================================== */}

                {viewMode ===
                  "grid" && (
                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-3

                      sm:mt-6
                      sm:gap-4

                      md:grid-cols-3

                      lg:gap-5

                      xl:grid-cols-4
                    "
                  >
                    {visibleProducts.map(
                      (product) => (
                        <ProductCard
                          key={
                            product.id
                          }
                          product={
                            product
                          }
                        />
                      ),
                    )}
                  </div>
                )}

                {/* ==============================================
                    LIST VIEW
                ============================================== */}

                {viewMode ===
                  "list" && (
                  <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:gap-4">
                    {visibleProducts.map(
                      (product) => (
                        <HorizontalProductCard
                          key={
                            product.id
                          }
                          product={
                            product
                          }
                        />
                      ),
                    )}
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                hasSearch={
                  Boolean(
                    search.trim(),
                  )
                }
                hasFilters={
                  activeFilterCount >
                  0
                }
                onClearSearch={() =>
                  setSearch("")
                }
                onClearFilters={
                  handleClearFilters
                }
              />
            )}

            {/* ==================================================
                LOAD MORE
            ================================================== */}

            {visibleProducts.length >
              0 && (
              <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-10 gap-2 rounded-xl px-5 sm:h-11"
                >
                  Load More Products

                  <ChevronDown className="h-4 w-4" />
                </Button>

                <p className="text-xs text-muted-foreground sm:text-sm">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {
                      visibleProducts.length
                    }
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    150
                  </span>{" "}
                  products
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </MainLayout>
  );
}

/* ================================================================
   VIEW SWITCHER
================================================================ */

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onChange: (
    mode: ViewMode,
  ) => void;
}

function ViewSwitcher({
  viewMode,
  onChange,
}: ViewSwitcherProps) {
  return (
    <div
      className="flex h-10 shrink-0 items-center gap-1 rounded-xl border border-border bg-background p-1"
      role="group"
      aria-label="Product view"
    >
      {/* Grid */}
      <Button
        type="button"
        variant={
          viewMode === "grid"
            ? "secondary"
            : "ghost"
        }
        size="icon"
        className="h-8 w-8 rounded-lg"
        onClick={() =>
          onChange("grid")
        }
        aria-label="Grid view"
        aria-pressed={
          viewMode === "grid"
        }
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>

      {/* List */}
      <Button
        type="button"
        variant={
          viewMode === "list"
            ? "secondary"
            : "ghost"
        }
        size="icon"
        className="h-8 w-8 rounded-lg"
        onClick={() =>
          onChange("list")
        }
        aria-label="List view"
        aria-pressed={
          viewMode === "list"
        }
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ================================================================
   ACTIVE FILTER SUMMARY
================================================================ */

interface ActiveFilterSummaryProps {
  filters: ProductFilters;
  onClear: () => void;
}

function ActiveFilterSummary({
  filters,
  onClear,
}: ActiveFilterSummaryProps) {
  const hasPriceFilter =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] <
      MAX_PRICE;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium text-muted-foreground">
        Active:
      </span>

      {filters.categoryId && (
        <FilterBadge label="Category selected" />
      )}

      {filters.brandIds.map(
        (brandId) => (
          <FilterBadge
            key={brandId}
            label={formatBrandName(
              brandId,
            )}
          />
        ),
      )}

      {filters.warrantyPeriods.map(
        (warranty) => (
          <FilterBadge
            key={warranty}
            label={warranty}
          />
        ),
      )}

      {hasPriceFilter && (
        <FilterBadge
          label={`৳${filters.priceRange[0].toLocaleString()} - ৳${filters.priceRange[1].toLocaleString()}`}
        />
      )}

      <button
        type="button"
        onClick={onClear}
        className="ml-1 text-xs font-medium text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

/* ================================================================
   FILTER BADGE
================================================================ */

function FilterBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
      {label}
    </span>
  );
}

/* ================================================================
   BRAND NAME FORMATTER
================================================================ */

function formatBrandName(
  brandId: string,
) {
  const names: Record<
    string,
    string
  > = {
    brand_vision: "Vision",
    brand_walton: "Walton",
    brand_philips: "Philips",
    brand_gree: "Gree",
    brand_samsung: "Samsung",
  };

  return (
    names[brandId] ??
    brandId
  );
}

/* ================================================================
   EMPTY STATE
================================================================ */

interface EmptyStateProps {
  hasSearch: boolean;
  hasFilters: boolean;
  onClearSearch: () => void;
  onClearFilters: () => void;
}

function EmptyState({
  hasSearch,
  hasFilters,
  onClearSearch,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="mt-6 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-base font-semibold">
        No products found
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-5 text-muted-foreground">
        We couldn't find any products
        matching your current search
        or filters.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {hasSearch && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={
              onClearSearch
            }
          >
            Clear Search
          </Button>
        )}

        {hasFilters && (
          <Button
            type="button"
            size="sm"
            onClick={
              onClearFilters
            }
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
