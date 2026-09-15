import type { Metadata } from "next";
import ProductListingClient from "@/components/modules/products/catalog/ProductListingClient";
import { productServices } from "@/services/product.service";
import { MOCK_BRANDS, MOCK_CATEGORIES } from "@/lib/fixtures/product/mockData";

/* ----------------------------- Types ---------------------------------- */
type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  brands?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
}>;

const DEFAULT_LIMIT = 24;
const MAX_PRICE = 1_000_000;
const SORT_OPTIONS: SortOption[] = [
  "popular",
  "price-asc",
  "price-desc",
  "newest",
];

function parseSort(value?: string): SortOption {
  return SORT_OPTIONS.includes(value as SortOption)
    ? (value as SortOption)
    : "popular";
}

function parseNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

/* --------------------------- Metadata --------------------------------- */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;

  if (params.category) {
    return {
      title: `${params.category} | Products`,
      description: `Browse genuine ${params.category} with verified warranty.`,
    };
  }

  if (params.q) {
    return {
      title: `Search: ${params.q}`,
      description: `Products matching "${params.q}".`,
      robots: { index: false, follow: true },
    };
  }

  return {
    title: "All Products | Authentic Electronics",
    description:
      "Browse 100% genuine electronics, fans, AC and home appliances with verified digital warranty.",
  };
}

/* ------------------------------ Page ---------------------------------- */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const page = Math.max(1, parseNumber(params.page) ?? 1);
  const search = params.q?.trim() || undefined;
  const categoryId = params.category;
  const brandIds = params.brands?.split(",").filter(Boolean) ?? [];
  const minPrice = parseNumber(params.minPrice);
  const maxPrice = parseNumber(params.maxPrice);
  const sort = parseSort(params.sort);

  /* -------- Parallel fetch -------- */
  const [productsRes] = await Promise.all([
    productServices.getProducts({
      search,
      categoryId,
      brandIds: brandIds.length ? brandIds : undefined,
      minPrice,
      maxPrice,
      sort,
      page,
      limit: DEFAULT_LIMIT,
      isPublished: true,
      isActive: true,
      options: { cache: "no-store" },
    }),
    productServices.getCategories({ cache: "no-store" }),
    productServices.getBrands({ cache: "no-store" }),
  ]);

  const products = productsRes?.data ?? [];
  console.log("products", productsRes);
  // const categories = categoriesRes?.data ?? [];
  // const brands = brandsRes?.data ?? [];
  const categories = MOCK_CATEGORIES;
  const brands = MOCK_BRANDS;
  const total = productsRes?.meta?.total ?? products.length;
  console.log("data", total);
  return (
    <ProductListingClient
      products={products}
      categories={categories}
      brands={brands}
      total={total}
      initialFilters={{
        search: search ?? "",
        categoryId: categoryId ?? null,
        brandIds,
        priceRange: [minPrice ?? 0, maxPrice ?? MAX_PRICE],
        sort,
      }}
    />
  );
}
