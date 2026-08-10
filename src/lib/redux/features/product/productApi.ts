import { baseApi } from '../../services/baseApi';
import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  mockGetProductBySlug,
  mockGetProducts,
  mockSearchProducts,
} from './mockData';
import type {
  Brand,
  Category,
  PaginatedProductsResponse,
  Product,
  ProductFilters,
} from './types';

function buildProductParams(filters: ProductFilters = {}) {
  const params: Record<string, string | number | boolean> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
  };

  if (filters.category && filters.category !== 'ALL') params.category = filters.category;
  if (filters.brand && filters.brand !== 'ALL') params.brand = filters.brand;
  if (filters.minPrice != null) params.minPrice = filters.minPrice;
  if (filters.maxPrice != null) params.maxPrice = filters.maxPrice;
  if (filters.search) params.search = filters.search;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.featured) params.featured = true;
  if (filters.isLatest) params.isLatest = true;

  return params;
}

function normalizeProductsResponse(response: unknown): PaginatedProductsResponse {
  if (Array.isArray(response)) {
    return {
      data: response as Product[],
      total: response.length,
      page: 1,
      limit: response.length,
      totalPages: 1,
    };
  }

  const r = response as Record<string, unknown>;
  const meta = (r.meta ?? {}) as Record<string, number>;

  return {
    data: (r.data ?? r.products ?? []) as Product[],
    total: (r.total ?? meta.total ?? 0) as number,
    page: (r.page ?? meta.page ?? 1) as number,
    limit: (r.limit ?? meta.limit ?? 12) as number,
    totalPages: (r.totalPages ?? meta.totalPages ?? 1) as number,
  };
}

function normalizeList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  const r = response as Record<string, unknown>;
  return (r.data ?? r.items ?? []) as T[];
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedProductsResponse, ProductFilters>({
      async queryFn(filters, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: '/products',
          params: buildProductParams(filters),
        });

        if (!result.error) {
          return { data: normalizeProductsResponse(result.data) };
        }

        return { data: mockGetProducts(filters) };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductBySlug: builder.query<Product, string>({
      async queryFn(slug, _api, _extraOptions, baseQuery) {
        const result = await baseQuery(`/products/${slug}`);

        if (!result.error && result.data) {
          const data = result.data as Record<string, unknown>;
          return { data: (data.data ?? data) as Product };
        }

        const mock = mockGetProductBySlug(slug);
        if (!mock) {
          return { error: { status: 404, data: 'Product not found' } };
        }
        return { data: mock };
      },
      providesTags: (_result, _error, slug) => [{ type: 'Product', id: slug }],
    }),

    searchProducts: builder.query<Product[], { q: string; limit?: number }>({
      async queryFn({ q, limit = 12 }, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: '/products/search',
          params: { q, limit },
        });

        if (!result.error) {
          return { data: normalizeList<Product>(result.data) };
        }

        return { data: mockSearchProducts(q, limit) };
      },
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
    }),

    getCategories: builder.query<Category[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('/categories');

        if (!result.error) {
          return { data: normalizeList<Category>(result.data) };
        }

        return { data: MOCK_CATEGORIES };
      },
      providesTags: [{ type: 'Product', id: 'CATEGORIES' }],
    }),

    getBrands: builder.query<Brand[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('/brands');

        if (!result.error) {
          return { data: normalizeList<Brand>(result.data) };
        }

        return { data: MOCK_BRANDS };
      },
      providesTags: [{ type: 'Product', id: 'BRANDS' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
} = productApi;
