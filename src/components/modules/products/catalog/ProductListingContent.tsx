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
  onAddToCart: (product: ProductCardData) => void;
  onClearFilters: () => void;
}

export function ProductListingContent({
  products,
  viewMode,
  isPending,
  currentPage,
  totalPages,
  onPageChange,
  onAddToCart,
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
              onAddToCart={onAddToCart}
            />
          ) : (
            <ProductList
              products={products}
              onAddToCart={onAddToCart}
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
