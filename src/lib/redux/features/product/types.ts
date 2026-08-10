export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  warrantyMonths: number;
  inStock: boolean;
  featured?: boolean;
  isLatest?: boolean;
  image: string;
  images?: string[];
  description?: string;
  specs?: ProductSpec[] | Record<string, string>;
  warrantyTerms?: string;
  relatedProducts?: RelatedProduct[];
}

export interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  warrantyMonths: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'newest';
  featured?: boolean;
  isLatest?: boolean;
}

export interface PaginatedProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}
