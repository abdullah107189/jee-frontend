import type { ProductDetail, ProductCardData } from "@/lib/types/product.types";

import type {
  GetProductsOptions,
  ProductFiltersResponse,
  ProductsResponse,
  ServiceOptions,
} from "./types/product.service.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PRODUCT_PAGE_SIZE = 10;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function buildProductQuery(options: GetProductsOptions) {
  const params = new URLSearchParams();

  if (options.search) {
    params.set("search", options.search);
  }

  if (options.categoryId) {
    params.set("categoryId", options.categoryId);
  }

  if (options.brandIds?.length) {
    params.set("brandIds", options.brandIds.join(","));
  }

  if (options.minPrice !== undefined) {
    params.set("minPrice", String(options.minPrice));
  }

  if (options.maxPrice !== undefined) {
    params.set("maxPrice", String(options.maxPrice));
  }

  // ⭐ IMPORTANT
  if (options.warrantyMonths?.length) {
    params.set("warrantyMonths", options.warrantyMonths.join(","));
  }

  if (options.sort) {
    params.set("sort", options.sort);
  }

  if (options.page !== undefined) {
    params.set("page", String(options.page));
  }

  if (options.limit !== undefined) {
    params.set("limit", String(options.limit));
  }

  if (options.isPublished !== undefined) {
    params.set("isPublished", String(options.isPublished));
  }

  if (options.isActive !== undefined) {
    params.set("isActive", String(options.isActive));
  }

  return params;
}

function buildFetchConfig(
  options?: ServiceOptions,
  tags: string[] = [],
): RequestInit {
  const config: RequestInit = {};

  if (options?.cache) {
    config.cache = options.cache;
  }

  if (options?.revalidate !== undefined) {
    config.next = {
      revalidate: options.revalidate,
    };
  }

  if (tags.length) {
    config.next = {
      ...config.next,
      tags,
    };
  }

  return config;
}

/* -------------------------------------------------------------------------- */
/* List                                                                       */
/* -------------------------------------------------------------------------- */

async function getProducts(
  options: GetProductsOptions = {},
): Promise<ProductsResponse<ProductCardData>> {
  const page = options.page ?? 1;

  const limit = Math.min(options.limit ?? PRODUCT_PAGE_SIZE, PRODUCT_PAGE_SIZE);

  const fallback: ProductsResponse<ProductCardData> = {
    success: false,
    data: [],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };

  try {
    const url = new URL(`${API_URL}/products`);

    url.search = buildProductQuery(options).toString();

    const config = buildFetchConfig(options.options, ["products"]);

    const response = await fetch(url.toString(), config);

    if (!response.ok) {
      console.error(`[productServices.getProducts] ${response.status}`);
      return fallback;
    }

    const result = await response.json();

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
}

/* -------------------------------------------------------------------------- */
/* Detail                                                                     */
/* -------------------------------------------------------------------------- */

async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  if (!slug) return null;

  try {
    const url = new URL(`${API_URL}/products/slug/${encodeURIComponent(slug)}`);

    const response = await fetch(
      url.toString(),
      buildFetchConfig(undefined, [`product:${slug}`]),
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    return (result.data as ProductDetail) ?? null;
  } catch (error) {
    console.error("[productServices.getProductBySlug]", error);

    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* get filter for warrenty                                                    */
/* -------------------------------------------------------------------------- */

const getProductFilters = async (): Promise<ProductFiltersResponse> => {
  try {
    const response = await fetch(`${API_URL}/products/filters`, {
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(`Product filters request failed: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: result.success === true || result.status === "success",

      data: result.data ?? {
        warrantyMonths: [],
        warranties: [],
      },

      message: result.message,
    };
  } catch (error) {
    console.error("[productServices.getProductFilters]", error);

    return {
      success: false,
      data: {
        warrantyMonths: [],
        warranties: [],
      },
      message: "Failed to fetch product filters",
    };
  }
};

export const productServices = {
  getProducts,
  getProductBySlug,
  getProductFilters,
};
