export const PRODUCT_PAGE_SIZE = 10;

export const MAX_PRICE = 1_000_000;

type CountActiveFiltersParams = {
  categoryId: string | null;
  brandIds: string[];
  warrantyMonths: number[];
  priceRange: [number, number];
};

export function countActiveFilters({
  categoryId,
  brandIds,
  warrantyMonths,
  priceRange,
}: CountActiveFiltersParams) {
  return (
    (categoryId ? 1 : 0) +
    brandIds.length +
    warrantyMonths.length +
    (priceRange[0] > 0 ? 1 : 0) +
    (priceRange[1] < MAX_PRICE ? 1 : 0)
  );
}

export function getTotalPages(
  total: number,
  limit = PRODUCT_PAGE_SIZE,
): number {
  return Math.max(1, Math.ceil(total / limit));
}
