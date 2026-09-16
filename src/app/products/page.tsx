import type { Metadata } from "next";
import ProductListingClient from "@/components/modules/products/catalog/ProductListingClient";
import { productServices } from "@/services/product.service";
import { MOCK_BRANDS, MOCK_CATEGORIES } from "@/lib/fixtures/product/mockData";
import { parseProductSearchParams, MAX_PRICE } from "./_lib/params";
import { buildProductMetadata } from "./_lib/metadata";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface ProductsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */
export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await parseProductSearchParams(searchParams);
  return buildProductMetadata(params);
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await parseProductSearchParams(searchParams);
  const PAGE_LIMIT = 20;

  /* ---------------- Parallel fetch ---------------- */
  const [productsRes] = await Promise.all([
    productServices.getProducts({
      search: params.search,
      categoryId: params.categoryId,
      brandIds: params.brandIds.length ? params.brandIds : undefined,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sort: params.sort,
      page: params.page,
      limit: PAGE_LIMIT,
      isPublished: true,
      isActive: true,
      options: { cache: "no-store" },
    }),
    // productServices.getCategories({ cache: "no-store" }),
    // productServices.getBrands({ cache: "no-store" }),
  ]);

  /* ---------------- Data ---------------- */
  const products = productsRes?.data ?? [];
  const total = productsRes?.total ?? 0;

  // TODO: replace with real API data
  const categories = MOCK_CATEGORIES;
  const brands = MOCK_BRANDS;

  /* ---------------- Render ---------------- */
  return (
    <ProductListingClient
      products={products}
      categories={categories}
      brands={brands}
      total={total}
      page={params.page}
      limit={PAGE_LIMIT}
      initialFilters={{
        search: params.search ?? "",
        categoryId: params.categoryId ?? null,
        brandIds: params.brandIds,
        priceRange: [params.minPrice ?? 0, params.maxPrice ?? MAX_PRICE],
        sort: params.sort,
      }}
    />
  );
}
