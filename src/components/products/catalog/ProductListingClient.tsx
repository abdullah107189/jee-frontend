"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import HorizontalProductCard from "@/components/shared/productCard/HorizontalProductCard";
import { addToCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import type { ProductItem } from "@/lib/types/product.types";
import type { Brand, Category } from "@/lib/fixtures/product/types";
import { MAX_PRICE, ProductFilters, SidebarFilters } from "../SidebarFilters";
import MainProductCard from "../MainProductCard";

type ViewMode = "grid" | "list";
type SortOption = "popular" | "price-asc" | "price-desc" | "newest" | "rating";

const DEFAULT_FILTERS: ProductFilters = {
  categoryId: null,
  brandIds: [],
  warrantyPeriods: [],
  priceRange: [0, MAX_PRICE],
};

export default function ProductListingClient({
  products,
  categories,
  brands,
}: {
  products: ProductItem[];
  categories: Category[];
  brands: Brand[];
}) {
  const dispatch = useAppDispatch();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = products.filter((item) => {
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

      if (query && !searchableText.includes(query)) return false;
      if (filters.categoryId && product.categoryId !== filters.categoryId)
        return false;
      if (
        filters.brandIds.length &&
        !filters.brandIds.includes(product.brandId || "")
      )
        return false;
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      )
        return false;

      if (
        filters.warrantyPeriods.length &&
        !filters.warrantyPeriods.some((period) => {
          const months = product.warrantyMonths;
          if (period === "1 Year") return months >= 12 && months < 24;
          if (period === "2 Years") return months >= 24 && months < 60;
          if (period === "5 Years") return months >= 60 && months < 120;
          return months >= 120;
        })
      )
        return false;

      return true;
    });

    if (sortBy === "price-asc")
      result.sort((a, b) => a.product.price - b.product.price);
    if (sortBy === "price-desc")
      result.sort((a, b) => b.product.price - a.product.price);
    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.product.createdAt).getTime() -
          new Date(a.product.createdAt).getTime(),
      );
    }

    return result;
  }, [filters, products, search, sortBy]);

  const activeFilterCount =
    (filters.categoryId ? 1 : 0) +
    filters.brandIds.length +
    filters.warrantyPeriods.length +
    (filters.priceRange[0] > 0 ? 1 : 0) +
    (filters.priceRange[1] < MAX_PRICE ? 1 : 0);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);
  const handleAddToCart = (item: ProductItem) => {
    const product = item.product;
    dispatch(
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.comparePrice ?? undefined,
        image: product.images?.[0],
        warrantyMonths: product.warrantyMonths,
        brand: product.brandId ?? undefined,
        category: product.categoryId ?? undefined,
      }),
    );
    toast.success(`${product.name} added to cart`);
  };

  return (
    <MainLayout>
      <main className="mxw">
        <Breadcrumb />
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
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <SidebarFilters
              filters={filters}
              categories={categories}
              brands={brands}
              onCategoryChange={(categoryId) =>
                setFilters((current) => ({ ...current, categoryId }))
              }
              onBrandChange={(brandId) =>
                setFilters((current) => ({
                  ...current,
                  brandIds: current.brandIds.includes(brandId)
                    ? current.brandIds.filter((id) => id !== brandId)
                    : [...current.brandIds, brandId],
                }))
              }
              onWarrantyChange={(warranty) =>
                setFilters((current) => ({
                  ...current,
                  warrantyPeriods: current.warrantyPeriods.includes(warranty)
                    ? current.warrantyPeriods.filter(
                        (item) => item !== warranty,
                      )
                    : [...current.warrantyPeriods, warranty],
                }))
              }
              onPriceChange={(priceRange) =>
                setFilters((current) => ({ ...current, priceRange }))
              }
              onClearFilters={clearFilters}
            />
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search in products..."
                  className="pl-10 pr-10"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowFilters((open) => !open)}
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters{" "}
                  {activeFilterCount > 0 && <Badge>{activeFilterCount}</Badge>}
                </Button>
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortOption)
                  }
                  className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
                >
                  <option value="popular">Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Top Rated</option>
                </select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setViewMode((mode) => (mode === "grid" ? "list" : "grid"))
                  }
                >
                  {viewMode === "grid" ? "List" : "Grid"}
                </Button>
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {visibleProducts.length}
              </span>{" "}
              products
            </p>
            {visibleProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-12 text-center">
                <h2 className="text-lg font-bold">No products found</h2>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <MainProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visibleProducts.map((product) => (
                  <HorizontalProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </MainLayout>
  );
}
