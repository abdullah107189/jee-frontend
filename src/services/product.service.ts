import type {
  ProductDetail,
  ProductCardData,
} from "@/lib/types/product.types";

import type {
  GetProductsOptions,
  ProductsResponse,
  ServiceOptions,
} from "./types/product.service.types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const PRODUCT_PAGE_SIZE = 10;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function buildProductQuery(
  options: GetProductsOptions,
): URLSearchParams {
  const query = new URLSearchParams();

  query.set(
    "page",
    String(options.page ?? 1),
  );

  query.set(
    "limit",
    String(
      Math.min(
        options.limit ?? PRODUCT_PAGE_SIZE,
        PRODUCT_PAGE_SIZE,
      ),
    ),
  );

  if (options.search) {
    query.set("search", options.search);
  }

  if (options.categoryId) {
    query.set(
      "categoryId",
      options.categoryId,
    );
  }

  if (options.brandIds?.length) {
    query.set(
      "brandIds",
      options.brandIds.join(","),
    );
  }

  if (options.minPrice !== undefined) {
    query.set(
      "minPrice",
      String(options.minPrice),
    );
  }

  if (options.maxPrice !== undefined) {
    query.set(
      "maxPrice",
      String(options.maxPrice),
    );
  }

  if (options.sort) {
    query.set("sort", options.sort);
  }

  if (options.isPublished !== undefined) {
    query.set(
      "isPublished",
      String(options.isPublished),
    );
  }

  if (options.isActive !== undefined) {
    query.set(
      "isActive",
      String(options.isActive),
    );
  }

  return query;
}

function buildFetchConfig(
  options?: ServiceOptions,
  tags: string[] = [],
): RequestInit {
  const config: RequestInit = {};

  if (options?.cache) {
    config.cache = options.cache;
  }

  if (
    options?.revalidate !== undefined
  ) {
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
): Promise<
  ProductsResponse<ProductCardData>
> {
  const page = options.page ?? 1;

  const limit = Math.min(
    options.limit ?? PRODUCT_PAGE_SIZE,
    PRODUCT_PAGE_SIZE,
  );

  const fallback: ProductsResponse<ProductCardData> =
    {
      success: false,
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };

  try {
    const url = new URL(
      `${API_URL}/products`,
    );

    url.search =
      buildProductQuery(options).toString();

    const config = buildFetchConfig(
      options.options,
      ["products"],
    );

    const response = await fetch(
      url.toString(),
      config,
    );

    if (!response.ok) {
      console.error(
        `[productServices.getProducts] ${response.status}`,
      );

      return fallback;
    }

    const result = await response.json();

    return {
      success:
        result.status === "success",

      data: result.data ?? [],

      total:
        result.meta?.total ?? 0,

      page:
        result.meta?.page ?? page,

      limit:
        result.meta?.limit ?? limit,

      totalPages:
        result.meta?.totalPages ?? 0,

      message: result.message,
    };
  } catch (error) {
    console.error(
      "[productServices.getProducts]",
      error,
    );

    return fallback;
  }
}

/* -------------------------------------------------------------------------- */
/* Detail                                                                     */
/* -------------------------------------------------------------------------- */

async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  if (!slug) return null;

  try {
    const url = new URL(
      `${API_URL}/products/slug/${encodeURIComponent(slug)}`,
    );

    const response = await fetch(
      url.toString(),
      buildFetchConfig(
        undefined,
        [`product:${slug}`],
      ),
    );

    if (!response.ok) {
      return null;
    }

    const result =
      await response.json();

    return (
      (result.data as ProductDetail) ??
      null
    );
  } catch (error) {
    console.error(
      "[productServices.getProductBySlug]",
      error,
    );

    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */

export const productServices = {
  getProducts,
  getProductBySlug,
};
