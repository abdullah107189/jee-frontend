import type { Product, ProductFilters, ProductItem, ProductListResponse } from "@/Types/product";

import { baseApi } from "../../services/baseApi";

import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  mockGetProductBySlug,
  mockGetProducts,
  mockSearchProducts,
} from "./mockData";

import type { Brand, Category } from "./types";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function buildProductParams(filters: ProductFilters = {}) {
  const params: Record<string, string | number | boolean> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
  };

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.categoryId) {
    params.categoryId = filters.categoryId;
  }

  if (filters.brandId) {
    params.brandId = filters.brandId;
  }

  if (filters.minPrice != null) {
    params.minPrice = filters.minPrice;
  }

  if (filters.maxPrice != null) {
    params.maxPrice = filters.maxPrice;
  }

  if (filters.isPublished != null) {
    params.isPublished = filters.isPublished;
  }

  if (filters.isActive != null) {
    params.isActive = filters.isActive;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  return params;
}

function normalizeList<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const data = response as Record<string, unknown>;

  return (data.data ?? data.items ?? []) as T[];
}

function normalizeProductList(response: unknown): ProductListResponse {
  if (Array.isArray(response)) {
    return {
      data: response as ProductItem[],
      total: response.length,
      page: 1,
      limit: response.length,
      totalPages: 1,
    };
  }

  if (!response || typeof response !== "object") {
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
    };
  }

  const result = response as Record<string, unknown>;
  const meta =
    typeof result.meta === "object" && result.meta !== null
      ? (result.meta as Record<string, unknown>)
      : {};

  return {
    data: (result.data ?? result.products ?? []) as ProductItem[],
    total: Number(result.total ?? meta.total ?? 0),
    page: Number(result.page ?? meta.page ?? 1),
    limit: Number(result.limit ?? meta.limit ?? 12),
    totalPages: Number(result.totalPages ?? meta.totalPages ?? 1),
  };
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ------------------------------- Products ------------------------------ */

    getProducts: builder.query<ProductListResponse, ProductFilters>({
      async queryFn(filters, _api, _extraOptions, baseQuery) {
        const response = await baseQuery({
          url: "/products",
          params: buildProductParams(filters),
        });

        if (!response.error) {
          return {
            data: normalizeProductList(response.data),
          };
        }

        return {
          data: mockGetProducts(filters),
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((item) => ({
                type: "Product" as const,
                id: item.productId,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),

    /* ---------------------------- Product Details --------------------------- */

    getProductBySlug: builder.query<Product, string>({
      async queryFn(slug, _api, _extraOptions, baseQuery) {
        const response = await baseQuery(`/products/${slug}`);

        if (!response.error && response.data) {
          const data = response.data as Record<string, unknown>;

          return {
            data: (data.data ?? data) as Product,
          };
        }

        const product = mockGetProductBySlug(slug);

        if (!product) {
          return {
            error: {
              status: 404,
              data: "Product not found",
            },
          };
        }

        return {
          data: product,
        };
      },

      providesTags: (_result, _error, slug) => [
        {
          type: "Product",
          id: slug,
        },
      ],
    }),

    /* -------------------------------- Search -------------------------------- */

    searchProducts: builder.query<ProductItem[], { q: string; limit?: number }>(
      {
        async queryFn({ q, limit = 12 }, _api, _extraOptions, baseQuery) {
          const response = await baseQuery({
            url: "/products/search",
            params: {
              q,
              limit,
            },
          });

          if (!response.error) {
            return {
              data: normalizeList<ProductItem>(response.data),
            };
          }

          return {
            data: mockSearchProducts(q, limit),
          };
        },

        providesTags: [{ type: "Product", id: "SEARCH" }],
      },
    ),

    /* ------------------------------- Categories ----------------------------- */

    getCategories: builder.query<Category[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const response = await baseQuery("/categories");

        if (!response.error) {
          return {
            data: normalizeList<Category>(response.data),
          };
        }

        return {
          data: MOCK_CATEGORIES,
        };
      },

      providesTags: [{ type: "Product", id: "CATEGORIES" }],
    }),

    /* -------------------------------- Brands -------------------------------- */

    getBrands: builder.query<Brand[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const response = await baseQuery("/brands");

        if (!response.error) {
          return {
            data: normalizeList<Brand>(response.data),
          };
        }

        return {
          data: MOCK_BRANDS,
        };
      },

      providesTags: [{ type: "Product", id: "BRANDS" }],
    }),
  }),
});

/* -------------------------------------------------------------------------- */
/* Hooks                                                                      */
/* -------------------------------------------------------------------------- */

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
} = productApi;
