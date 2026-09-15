/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */
export const DEFAULT_LIMIT = 24;
export const MAX_PRICE = 1_000_000;

export const SORT_OPTIONS = [
  "popular",
  "price-asc",
  "price-desc",
  "newest",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

/* -------------------------------------------------------------------------- */
/* Parsers                                                                    */
/* -------------------------------------------------------------------------- */
export function parseSort(value?: string): SortOption {
  return SORT_OPTIONS.includes(value as SortOption)
    ? (value as SortOption)
    : "popular";
}

export function parseNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

export function parseCsv(value?: string): string[] {
  return value?.split(",").filter(Boolean) ?? [];
}

/* -------------------------------------------------------------------------- */
/* Full filter parser                                                         */
/* -------------------------------------------------------------------------- */
export interface ParsedProductParams {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  brandIds: string[];
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;
}

export async function parseProductSearchParams(
  searchParams: Promise<Record<string, string | undefined>>,
): Promise<ParsedProductParams> {
  const params = await searchParams;

  return {
    page: Math.max(1, parseNumber(params.page) ?? 1),
    limit: DEFAULT_LIMIT,
    search: params.q?.trim() || undefined,
    categoryId: params.category,
    brandIds: parseCsv(params.brands),
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
    sort: parseSort(params.sort),
  };
}