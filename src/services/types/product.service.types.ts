export type ProductSort =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "newest";

export interface GetProductsOptions {
  search?: string;
  categoryId?: string;
  brandIds?: string[];

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
