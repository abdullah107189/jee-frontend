export interface CategoryPageParams {
  slug: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  warrantyMonths?: string;
  sort?: string;
  page: number;
  filter: Record<string, string>;
}

const KNOWN_KEYS = new Set([
  "brand",
  "brandId",
  "minPrice",
  "maxPrice",
  "warrantyMonths",
  "sort",
  "sortBy",
  "page",
]);

export async function parseCategorySearchParams(
  slug: string[],
  searchParams: Promise<Record<string, string | undefined>>,
): Promise<CategoryPageParams> {
  const params = await searchParams;

  // dynamic attribute filters (color, size, capacity…)
  const filter: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!KNOWN_KEYS.has(key) && value) filter[key] = value;
  }

  return {
    slug: slug.join("/"),
    brand: params.brand ?? params.brandId,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    warrantyMonths: params.warrantyMonths,
    sort: params.sort ?? params.sortBy,
    page: Number(params.page) || 1,
    filter,
  };
}