"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface CategoryOption {
  categoryId: string;
  name: string;
}

interface BrandOption {
  brandId: string;
  name: string;
}

interface ProductFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedBrand: string;
  minPrice: string;
  maxPrice: string;

  categories: CategoryOption[];
  brands: BrandOption[];

  totalItems: number;
  hasActiveFilters: boolean;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void;
}

export default function ProductFilters({
  searchTerm,
  selectedCategory,
  selectedBrand,
  minPrice,
  maxPrice,
  categories,
  brands,
  totalItems,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onBrandChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}: ProductFiltersProps) {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-sm">
      {/* Header */}
      <CardHeader className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filters
          </CardTitle>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 rounded-lg px-2 text-xs font-semibold text-primary hover:text-primary"
            >
              Clear all
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedCategory !== "ALL" && (
              <Badge variant="outline" className="rounded-full text-[10px]">
                {selectedCategory}
              </Badge>
            )}

            {selectedBrand !== "ALL" && (
              <Badge variant="outline" className="rounded-full text-[10px]">
                {selectedBrand}
              </Badge>
            )}

            {searchTerm.trim() && (
              <Badge variant="outline" className="max-w-full rounded-full text-[10px]">
                <span className="truncate">
                  Search: {searchTerm.trim()}
                </span>
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      {/* Filter Body */}
      <CardContent className="space-y-5 p-4 sm:p-5">
        {/* Search */}
        <div className="space-y-2">
          <label
            htmlFor="product-search"
            className="text-xs font-bold text-foreground"
          >
            Search products
          </label>

          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              id="product-search"
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search products..."
              autoComplete="off"
              className="h-11 rounded-xl pl-9 pr-9"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear product search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label
            htmlFor="product-category"
            className="text-xs font-bold text-foreground"
          >
            Category
          </label>

          <select
            id="product-category"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Categories</option>

            {categories.map((category) => (
              <option
                key={category.categoryId}
                value={category.categoryId}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <label
            htmlFor="product-brand"
            className="text-xs font-bold text-foreground"
          >
            Brand
          </label>

          <select
            id="product-brand"
            value={selectedBrand}
            onChange={(event) => onBrandChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Brands</option>

            {brands.map((brand) => (
              <option
                key={brand.brandId}
                value={brand.brandId}
              >
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label
            htmlFor="min-price"
            className="text-xs font-bold text-foreground"
          >
            Price range
          </label>

          <div className="grid grid-cols-2 gap-2">
            <Input
              id="min-price"
              type="number"
              min={0}
              value={minPrice}
              onChange={(event) => onMinPriceChange(event.target.value)}
              inputMode="numeric"
              placeholder="Min"
              className="h-11 rounded-xl"
            />

            <Input
              id="max-price"
              type="number"
              min={0}
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              inputMode="numeric"
              placeholder="Max"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        {/* Result Summary */}
        <div className="rounded-xl bg-muted/60 p-3">
          <p className="text-sm font-bold text-foreground">
            {totalItems.toLocaleString()} products
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Products available in our catalog
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
