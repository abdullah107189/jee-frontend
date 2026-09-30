export interface CategoryPageParams {
  slug: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  warrantyMonths?: string;
  sort?: string;
  page: number;
}

export async function parseCategorySearchParams(
  slug: string[],
  searchParams: Promise<Record<string, string | undefined>>,
): Promise<CategoryPageParams> {
  const params = await searchParams;

  return {
    slug: slug.join("/"),
    brand: params.brand,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    warrantyMonths: params.warrantyMonths,
    sort: params.sort,
    page: Number(params.page) || 1,
  };
}