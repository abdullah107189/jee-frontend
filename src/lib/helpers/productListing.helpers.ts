export const PRODUCT_PAGE_SIZE = 10;

export const MAX_PRICE = 1_000_000;

export function countActiveFilters(filters: {
  categoryId: string | null;
  brandIds: string[];
  priceRange: [number, number];
}): number {
  return (
    (filters.categoryId ? 1 : 0) +
    filters.brandIds.length +
    (filters.priceRange[0] > 0 ? 1 : 0) +
    (filters.priceRange[1] < MAX_PRICE ? 1 : 0)
  );
}

export function getTotalPages(
  total: number,
  limit = PRODUCT_PAGE_SIZE,
): number {
  return Math.max(1, Math.ceil(total / limit));
}
