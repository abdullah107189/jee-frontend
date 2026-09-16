import { cookies } from "next/headers";
import type { ProductDetail } from "@/lib/types/product.types";
import type { Brand, Category } from "@/lib/fixtures/product/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
export interface ProductParams {
  search?: string;
  categoryId?: string;
  brandIds?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  limit?: string;
  isPublished?: string;
  isActive?: string;
}

export interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

export interface GetProductsOptions {
  search?: string;
  categoryId?: string;
  brandIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "popular" | "price-asc" | "price-desc" | "newest";
  page?: number;
  limit?: number;
  isPublished?: boolean;
  isActive?: boolean;
  options?: ServiceOptions;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */
function buildQuery(options: GetProductsOptions): URLSearchParams {
  const query = new URLSearchParams();

  query.set("page", String(options.page ?? 1));
  query.set("limit", String(options.limit ?? 24));

  if (options.search) query.set("search", options.search);
  if (options.categoryId) query.set("categoryId", options.categoryId);
  if (options.brandIds?.length)
    query.set("brandIds", options.brandIds.join(","));
  if (options.minPrice !== undefined)
    query.set("minPrice", String(options.minPrice));
  if (options.maxPrice !== undefined)
    query.set("maxPrice", String(options.maxPrice));
  if (options.sort) query.set("sort", options.sort);
  if (options.isPublished !== undefined)
    query.set("isPublished", String(options.isPublished));
  if (options.isActive !== undefined)
    query.set("isActive", String(options.isActive));

  return query;
}

function buildConfig(options?: ServiceOptions): RequestInit {
  const config: RequestInit = {};

  if (options?.cache) config.cache = options.cache;
  if (options?.revalidate) config.next = { revalidate: options.revalidate };

  return config;
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */
const getProducts = async (options: GetProductsOptions = {}) => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;

  const fallback = {
    success: false,
    data: [],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };

  try {
    const url = new URL(`${API_URL}/products`);
    url.search = buildQuery(options).toString();

    const config = buildConfig(options.options);
    config.next = { ...config.next, tags: ["products"] };

    const res = await fetch(url.toString(), config);
    const result = await res.json();

    return {
      success: result.status === "success",
      data: result.data ?? [],
      total: result.meta?.total ?? 0,
      page: result.meta?.page ?? page,
      limit: result.meta?.limit ?? limit,
      totalPages: result.meta?.totalPages ?? 0,
      message: result.message,
    };
  } catch (error) {
    console.error("[productServices.getProducts]", error);
    return fallback;
  }
};
const getCategories = async (options?: ServiceOptions) => {
  try {
    const url = new URL(`${API_URL}/categories`);
    const config = buildConfig(options);
    config.next = { ...config.next, tags: ["categories"] };

    const res = await fetch(url.toString(), config);
    const result = await res.json();
    return result;
  } catch (error) {
    return { success: false, data: null, error: error };
  }
};

const getBrands = async (options?: ServiceOptions) => {
  try {
    const url = new URL(`${API_URL}/brands`);
    const config = buildConfig(options);
    config.next = { ...config.next, tags: ["brands"] };

    const res = await fetch(url.toString(), config);
    const result = await res.json();
    return result;
  } catch (error) {
    return { success: false, data: null, error: error };
  }
};

/* -------------------------------------------------------------------------- */
/* Detail                                                                    */
/* -------------------------------------------------------------------------- */
const getProductBySlug = async (
  slug: string,
): Promise<ProductDetail | null> => {
  try {
    const url = new URL(`${API_URL}/products/slug/${slug}`);
    const res = await fetch(url.toString(), {
      next: { tags: [`product:${slug}`] },
    });

    if (!res.ok) return null;

    const result = await res.json();
    return (result.data as ProductDetail) ?? null;
  } catch (error) {
    console.error("[productServices.getProductBySlug]", error);
    return null;
  }
};

export const productServices = {
  getProducts,
  getCategories,
  getBrands,
  getProductBySlug,
};
