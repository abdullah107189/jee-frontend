"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { SortOption, ViewMode } from "./ProductListingClient";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface ProductListingToolbarProps {
  searchInput: string;
  onSearchInput: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClearSearch: () => void;

  sort: SortOption;
  onSortChange: (v: SortOption) => void;

  viewMode: ViewMode;
  onToggleView: () => void;

  onOpenFilters: () => void;
  activeFilterCount: number;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function ProductListingToolbar({
  searchInput,
  onSearchInput,
  onSearch,
  onClearSearch,
  sort,
  onSortChange,
  viewMode,
  onToggleView,
  onOpenFilters,
  activeFilterCount,
}: ProductListingToolbarProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <form onSubmit={onSearch} className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={searchInput}
          onChange={(e) => onSearchInput(e.target.value)}
          placeholder="Search products..."
          className="pl-10 pr-10"
          aria-label="Search products"
        />

        {searchInput && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile filters */}
        <Button
          type="button"
          variant="outline"
          className="gap-2 lg:hidden"
          onClick={onOpenFilters}
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
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          aria-label="Sort products"
        >
          <option value="popular">Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>

        {/* View toggle */}
        <Button
          type="button"
          variant="outline"
          onClick={onToggleView}
          aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
        >
          {viewMode === "grid" ? "List" : "Grid"}
        </Button>
      </div>
    </div>
  );
}