"use client";
import { ProductCardData, ViewMode } from "@/lib/types/product.types";
import { ProductListingPending } from "./ProductListingPending";
import { ProductListingEmpty } from "./ProductListingEmpty";
import { ProductGrid } from "./ProductGrid";
import { ProductList } from "./ProductList";
import { ProductPagination } from "./ProductPagination";



interface ProductListingContentProps {
  products: ProductCardData[];
  viewMode: ViewMode;
  isPending: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function ProductListingContent({
  products,
  viewMode,
  isPending,
  currentPage,
  totalPages,
  onPageChange,
  onClearFilters,
}: ProductListingContentProps) {
  return (
    <div className="relative">
      {isPending && <ProductListingPending />}

      {products.length === 0 ? (
        <ProductListingEmpty onClear={onClearFilters} />
      ) : (
        <>
          {viewMode === "grid" ? (
            <ProductGrid
              products={products}
            />
          ) : (
            <ProductList
              products={products}
            />
          )}

          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isPending={isPending}
          />
        </>
      )}
    </div>
  );
}
