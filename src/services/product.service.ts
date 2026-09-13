import { productsData } from '@/dammyData/products';
import type {
  Product,
  ProductFilters,
  ProductItem,
  ProductListResponse,
} from '@/lib/types/product.types';
import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  mockGetProductBySlug,
  mockGetProducts,
  mockSearchProducts,
} from '@/lib/fixtures/product/mockData';
import type { Brand, Category } from '@/lib/fixtures/product/types';

function buildProductParams(filters: ProductFilters = {}) {
  const params = new URLSearchParams({
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 12),
  });

  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.brandId) params.set('brandId', filters.brandId);
  if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
  if (filters.isPublished != null) params.set('isPublished', String(filters.isPublished));
  if (filters.isActive != null) params.set('isActive', String(filters.isActive));
  if (filters.status) params.set('status', filters.status);

  return params;
}

function normalizeList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  if (!response || typeof response !== 'object') return [];

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

  if (!response || typeof response !== 'object') {
    return { data: [], total: 0, page: 1, limit: 12, totalPages: 1 };
  }

  const result = response as Record<string, unknown>;
  const meta =
    typeof result.meta === 'object' && result.meta !== null
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

async function fetchProductApi(path: string, params?: URLSearchParams) {
  const apiBaseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) return null;

  try {
    const url = new URL(path, apiBaseUrl);
    if (params) url.search = params.toString();

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;

    return response.json() as Promise<unknown>;
  } catch {
    return null;
  }
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductListResponse> {
  const response = await fetchProductApi('/products', buildProductParams(filters));
  return response == null ? mockGetProducts(filters) : normalizeProductList(response);
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const response = await fetchProductApi(`/products/${encodeURIComponent(slug)}`);

  if (response && typeof response === 'object') {
    const data = response as Record<string, unknown>;
    return (data.data ?? data) as ProductItem;
  }

  return mockGetProductBySlug(slug);
}

export async function searchProducts(query: string, limit = 12): Promise<ProductItem[]> {
  const response = await fetchProductApi(
    '/products/search',
    new URLSearchParams({ q: query, limit: String(limit) }),
  );

  return response == null ? mockSearchProducts(query, limit) : normalizeList<ProductItem>(response);
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetchProductApi('/categories');
  return response == null ? MOCK_CATEGORIES : normalizeList<Category>(response);
}

export async function getBrands(): Promise<Brand[]> {
  const response = await fetchProductApi('/brands');
  return response == null ? MOCK_BRANDS : normalizeList<Brand>(response);
}

type LegacyProduct = (typeof productsData)[number];

export async function getProductDetailsBySlug(slug: string): Promise<LegacyProduct | null> {
  const product = productsData.find(
    (item) => item.slug === slug && item.isPublished && item.isActive,
  );

  return product ?? null;
}

export type { Brand, Category, Product, ProductFilters, ProductItem, ProductListResponse };