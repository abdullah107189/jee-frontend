import type { WarrantyFilterOption } from "@/lib/fixtures/product/types";

export type ProductSort = "popular" | "price-asc" | "price-desc" | "newest";

export interface GetProductsOptions {
  search?: string;
  categoryId?: string;
  brandIds?: string[];
  warrantyMonths?: number[];
  minPrice?: number;
  maxPrice?: number;

  sort?: ProductSort;

  page?: number;
  limit?: number;

  isPublished?: boolean;
  isActive?: boolean;

  options?: ServiceOptions;
}

export interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

export interface ProductsResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message?: string;
}

export interface ProductFiltersResponse {
  success: boolean;
  data: ProductFilters;
  message?: string;
}
export interface ProductFilters {
  warrantyMonths: number[];
  warranties: WarrantyFilterOption[];
  // Add other filters here when needed
  // categories?: Category[];
  // brands?: Brand[];
  // priceRange?: {
  //   min: number;
  //   max: number;
  // };
}
