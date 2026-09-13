"use client";

import type { ReactNode } from "react";
import { Filter, RotateCcw } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MOCK_CATEGORIES } from "@/lib/fixtures/product/mockData";
import type { Brand, Category } from "@/lib/fixtures/product/types";
import { Slider } from "../ui/slider";

/* ================================================================
   TYPES
================================================================ */

export type ProductFilters = {
  categoryId: string | null;
  brandIds: string[];
  warrantyPeriods: string[];
  priceRange: [number, number];
};

type SidebarFiltersProps = {
  filters: ProductFilters;
  categories?: Category[];
  brands?: Brand[];

  onCategoryChange: (
    categoryId: string | null,
  ) => void;

  onBrandChange: (brandId: string) => void;

  onWarrantyChange: (
    warranty: string,
  ) => void;

  onPriceChange: (
    range: [number, number],
  ) => void;

  onClearFilters: () => void;
};

/* ================================================================
   CONSTANTS
================================================================ */

export const MAX_PRICE = 100000;

export const BRANDS = [
  {
    id: "brand_vision",
    name: "Vision",
  },
  {
    id: "brand_walton",
    name: "Walton",
  },
  {
    id: "brand_philips",
    name: "Philips",
  },
  {
    id: "brand_gree",
    name: "Gree",
  },
  {
    id: "brand_samsung",
    name: "Samsung",
  },
];

export const WARRANTY_PERIODS = [
  {
    value: "1 Year",
    label: "1 Year",
  },
  {
    value: "2 Years",
    label: "2 Years",
  },
  {
    value: "5 Years",
    label: "5 Years",
  },
  {
    value: "10 Years",
    label: "10 Years",
  },
];

/* ================================================================
   COMPONENT
================================================================ */

export function SidebarFilters({
  filters,
  categories = MOCK_CATEGORIES,
  brands,
  onCategoryChange,
  onBrandChange,
  onWarrantyChange,
  onPriceChange,
  onClearFilters,
}: SidebarFiltersProps) {
  const {
    categoryId,
    brandIds,
    warrantyPeriods,
    priceRange,
  } = filters;

  const activeFilterCount =
    (categoryId ? 1 : 0) +
    brandIds.length +
    warrantyPeriods.length +
    (priceRange[0] > 0 ? 1 : 0) +
    (priceRange[1] < MAX_PRICE ? 1 : 0);

  return (
    <aside className="flex w-full flex-col gap-6 lg:w-70 lg:shrink-0">
      {/* ==========================================================
          FILTER HEADER
      ========================================================== */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />

          <h2 className="text-sm font-semibold">
            Filters
          </h2>

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

      {/* ==========================================================
          CATEGORIES
      ========================================================== */}

      <FilterSection
        title="Categories"
        noBorder
      >
        <div className="flex flex-col gap-1">
          {categories.map((category) => {
            /*
             * IMPORTANT:
             *
             * তোমার category data-তে id থাকলে:
             *
             * category.categoryId
             *
             * ব্যবহার হবে।
             */

            const isSelected =
              categoryId === category.categoryId;

            return (
              <button
                key={category.categoryId}
                type="button"
                onClick={() =>
                  onCategoryChange(
                    isSelected
                      ? null
                      : category.categoryId,
                  )
                }
                className={[
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all",
                  isSelected
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                ].join(" ")}
              >
                <span>{category.name}</span>

                <span
                  className={
                    isSelected
                      ? "text-xs text-primary"
                      : "text-xs text-muted-foreground"
                  }
                >
                  {category.productCount}
                </span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* ==========================================================
          PRICE
      ========================================================== */}

      <FilterSection title="Price Range">
        <div className="px-1">
          <Slider
            value={priceRange}
            min={0}
            max={MAX_PRICE}
            step={500}
            onValueChange={(value) => {
              if (
                Array.isArray(value) &&
                value.length === 2
              ) {
                onPriceChange([
                  value[0],
                  value[1],
                ]);
              }
            }}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {/* MIN */}

          <div>
            <label
              htmlFor="min-price"
              className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              Min
            </label>

            <Input
              id="min-price"
              value={`৳ ${priceRange[0].toLocaleString(
                "en-US",
              )}`}
              readOnly
              className="h-9 text-xs"
            />
          </div>

          {/* MAX */}

          <div>
            <label
              htmlFor="max-price"
              className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              Max
            </label>

            <Input
              id="max-price"
              value={`৳ ${priceRange[1].toLocaleString(
                "en-US",
              )}`}
              readOnly
              className="h-9 text-xs"
            />
          </div>
        </div>
      </FilterSection>

      {/* ==========================================================
          BRANDS
      ========================================================== */}

      <FilterSection title="Brands">
        <div className="flex flex-col gap-3">
          {(brands ?? BRANDS.map((brand) => ({ brandId: brand.id, name: brand.name }))).map((brand) => {
            const checked =
              brandIds.includes(brand.brandId);

            return (
              <label
                key={brand.brandId}
                htmlFor={`brand-${brand.brandId}`}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  id={`brand-${brand.brandId}`}
                  checked={checked}
                  onCheckedChange={() =>
                    onBrandChange(brand.brandId)
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

      {/* ==========================================================
          WARRANTY
      ========================================================== */}

      <FilterSection title="Warranty Period">
        <div className="flex flex-col gap-3">
          {WARRANTY_PERIODS.map((warranty) => {
            const checked =
              warrantyPeriods.includes(
                warranty.value,
              );

            return (
              <label
                key={warranty.value}
                htmlFor={`warranty-${warranty.value}`}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  id={`warranty-${warranty.value}`}
                  checked={checked}
                  onCheckedChange={() =>
                    onWarrantyChange(
                      warranty.value,
                    )
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

      {/* ==========================================================
          SALE CARD
      ========================================================== */}

      <div className="rounded-xl border border-primary/25 bg-primary/10 p-4 sm:p-5">
        <p className="text-base font-semibold">
          Summer Sale!
        </p>

        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Get up to 20% off on all Vision fans and AC
          units.
        </p>

        <Button className="mt-4 w-full">
          Shop Now
        </Button>
      </div>
    </aside>
  );
}

/* ================================================================
   FILTER SECTION
================================================================ */

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
        !noBorder &&
          "border-t border-border pt-5 lg:pt-6",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h3 className="mb-3 text-sm font-semibold">
        {title}
      </h3>

      {children}
    </section>
  );
}
