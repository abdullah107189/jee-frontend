"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "sonner";

import type {
  ProductCardData,
  ProductListingClientProps,
  SortOption,
  ViewMode,
} from "@/lib/types/product.types";

import { MobileFilterDrawer } from "../filters/MobileFilterDrawer";
import { MAX_PRICE, SidebarFilters } from "../filters/SidebarFilters";
import { ProductListingHeader } from "./ProductListingHeader";
import { ProductListingToolbar } from "./ProductListingToolbar";
import { useProductListing } from "@/hooks/products/useProductListing";
import {
  countActiveFilters,
  getTotalPages,
  PRODUCT_PAGE_SIZE,
} from "@/lib/helpers/productListing.helpers";
import { ProductListingContent } from "./ProductListingContent";

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

  const { isPending, updateURL, clearFilters, changePage } =
    useProductListing();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters.search);

  /*
   * --------------------------------------------------------------------------
   * Derived
   * --------------------------------------------------------------------------
   */

  // Always use maximum 10 products per page.
  const pageSize = Math.min(limit || PRODUCT_PAGE_SIZE, PRODUCT_PAGE_SIZE);

  const totalPages = getTotalPages(total, pageSize);

  const activeFilterCount = countActiveFilters({
    categoryId: initialFilters.categoryId,
    brandIds: initialFilters.brandIds,
    priceRange: initialFilters.priceRange,
  });

  /*
   * --------------------------------------------------------------------------
   * Search
   * --------------------------------------------------------------------------
   */

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    updateURL({
      q: searchInput.trim() || null,
    });
  };

  /*
   * --------------------------------------------------------------------------
   * Filters
   * --------------------------------------------------------------------------
   */

  const handleCategoryChange = (categoryId: string | null) => {
    updateURL({
      category: categoryId,
    });

    setShowFilters(false);
  };

  const handleBrandChange = (brandId: string) => {
    const current = initialFilters.brandIds;

    const next = current.includes(brandId)
      ? current.filter((id) => id !== brandId)
      : [...current, brandId];

    updateURL({
      brands: next.length ? next.join(",") : null,
    });
  };

  const handleWarrantyChange = (_period: string) => {
    // TODO: implement warranty filter
  };

  const handlePriceChange = (range: [number, number]) => {
    updateURL({
      minPrice: range[0] > 0 ? String(range[0]) : null,

      maxPrice: range[1] < MAX_PRICE ? String(range[1]) : null,
    });
  };

  /*
   * --------------------------------------------------------------------------
   * Sort
   * --------------------------------------------------------------------------
   */

  const handleSortChange = (value: SortOption) => {
    updateURL({
      sort: value === "popular" ? null : value,
    });
  };

  /*
   * --------------------------------------------------------------------------
   * Clear filters
   * --------------------------------------------------------------------------
   */

  const handleClearFilters = () => {
    setSearchInput("");
    clearFilters();
  };

  /*
   * --------------------------------------------------------------------------
   * Cart
   * --------------------------------------------------------------------------
   */

  const handleAddToCart = (product: ProductCardData) => {
    dispatch(
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,

        image: product.image || "/product-placeholder.jpg",

        warrantyMonths: product.warrantyMonths,

        stockQuantity: 1,

        maxQuantity: product.stockQuantity,
      }),
    );

    toast.success(`${product.name} added to cart`);
  };

  /*
   * --------------------------------------------------------------------------
   * Sidebar
   * --------------------------------------------------------------------------
   */
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

  /*
   * --------------------------------------------------------------------------
   * Render
   * --------------------------------------------------------------------------
   */

  return (
    <main className="mxw">
      <ProductListingHeader />

      <div className="mt-5 flex flex-col gap-5 sm:mt-8 lg:flex-row lg:gap-8 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0 sticky top-0 z-10">
          <SidebarFilters {...sidebarFiltersProps} />
        </aside>

        {/* Mobile Filters */}
        {showFilters && (
          <MobileFilterDrawer
            total={total}
            onClose={() => setShowFilters(false)}
            sidebarFiltersProps={sidebarFiltersProps}
          />
        )}

        {/* Main Content */}
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
              setViewMode((mode) => (mode === "grid" ? "list" : "grid"))
            }
            onOpenFilters={() => setShowFilters(true)}
            activeFilterCount={activeFilterCount}
          />

          <ProductListingContent
            products={products}
            viewMode={viewMode}
            isPending={isPending}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={changePage}
            onAddToCart={handleAddToCart}
            onClearFilters={handleClearFilters}
          />
        </section>
      </div>
    </main>
  );
}
