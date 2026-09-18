"use client";

import type { ReactNode } from "react";
import { Filter, RotateCcw } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Brand,
  Category,
  WarrantyFilterOption,
} from "@/lib/fixtures/product/types";
import { PriceRangeSection } from "./PriceRangeSection";
import { MAX_PRICE } from "@/app/(public)/products/_lib/params";

export type ProductFilters = {
  categoryId: string | null;
  brandIds: string[];
  warrantyMonths: number[];
  priceRange: [number, number];
};

type SidebarFiltersProps = {
  filters: ProductFilters;
  categories?: Category[];
  brands?: Brand[];
  warranties: WarrantyFilterOption[];

  onCategoryChange: (id: string | null) => void;
  onBrandChange: (brandId: string) => void;
  onWarrantyChange: (months: number) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
};


export function SidebarFilters({
  filters,
  categories = [],
  brands = [],
  warranties = [],
  onCategoryChange,
  onBrandChange,
  onWarrantyChange,
  onPriceChange,
  onClearFilters,
}: SidebarFiltersProps) {
  const {
    categoryId,
    brandIds,
    warrantyMonths,
    priceRange,
  } = filters;


  const activeFilterCount =
    (categoryId ? 1 : 0) +
    brandIds.length +
    warrantyMonths.length +
    (priceRange[0] > 0 ? 1 : 0) +
    (priceRange[1] < MAX_PRICE ? 1 : 0);


  return (
    <aside className="mb-10 flex w-full flex-col gap-6 lg:w-70 lg:shrink-0">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />

          <h2 className="text-sm font-semibold">Filters</h2>

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Categories" noBorder>
        <div className="flex flex-col gap-1">
          {categories.map((category) => {
            const isSelected = categoryId === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  onCategoryChange(
                    isSelected ? null : category.id,
                  )
                }
                className={[
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all",
                  isSelected
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                ].join(" ")}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <PriceRangeSection
          priceRange={priceRange}
          maxPrice={MAX_PRICE}
          onPriceChange={onPriceChange}
          debounceMs={500}
        />
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands">
        <div className="flex flex-col gap-3">
          {brands.map((brand) => {
            const checked = brandIds.includes(brand.id);

            return (
              <label
                key={brand.id}
                htmlFor={`brand-${brand.id}`}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={checked}
                  onCheckedChange={() =>
                    onBrandChange(brand.id)
                  }
                />

                <span
                  className={
                    checked
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {brand.name}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Warranty">
        <div className="flex flex-col gap-3">
          {warranties.map((warranty) => {
            const checked = warrantyMonths.includes(warranty.months);

            return (
              <label
                key={warranty.months}
                htmlFor={`warranty-${warranty.months}`}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  id={`warranty-${warranty.months}`}
                  checked={checked}
                  onCheckedChange={() =>
                    onWarrantyChange(warranty.months)
                  }
                />

                <span
                  className={
                    checked
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {warranty.label}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

    </aside>
  );
}

type FilterSectionProps = {
  title: string;
  children: ReactNode;
  noBorder?: boolean;
};

function FilterSection({
  title,
  children,
  noBorder = false,
}: FilterSectionProps) {
  return (
    <section
      className={[
        !noBorder && "border-t border-border pt-5 lg:pt-6",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>

      {children}
    </section>
  );
}
