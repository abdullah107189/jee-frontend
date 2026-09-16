import { Brand, Category } from "../fixtures/product/types";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;

  price: number;
  comparePrice: number | null;

  image: string | null;

  warrantyMonths: number;
  stockQuantity: number;

  brandName: string | null;
  categoryName: string | null;
};

export type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

export type ViewMode = "grid" | "list";

export interface initialFilters {
  search: string;
  categoryId: string | null;
  brandIds: string[];
  warrantyMonths: number[];
  priceRange: [number, number];
  sort: SortOption;
}

export interface ProductListingClientProps {
  products: ProductCardData[];
  categories: Category[];
  warranties: { months: number; label: string }[];
  brands: Brand[];
  total: number;
  page: number;
  limit: number;
  initialFilters: initialFilters;
}

export interface SidebarFiltersProps {
  filters: {
    categoryId: string | null;
    brandIds: string[];
    warrantyPeriods: string[];
    priceRange: [number, number];
  };
  categories: Category[];
  brands: Brand[];
  onCategoryChange: (categoryId: string | null) => void;
  onBrandChange: (brandId: string) => void;
  onWarrantyChange: (period: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

/* -------------------------------------------------------------------------- */
/* Detail — backend `/products/slug/:slug` response                           */
/* -------------------------------------------------------------------------- */
export type ProductVariantDetail = {
  id: string;
  sku: string;
  attributes: Record<string, string | number | boolean | null>;
  price: number;
  comparePrice: number | null;
  images: string[];
  isDefault: boolean;
  stockQuantity: number;
  inStock: boolean;
};

export type ProductCategoryRef = {
  id: string;
  name: string;
  slug: string;
};

export type ProductBrandRef = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
};

export type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string | null;
  brandName: string | null;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specifications: Record<string, string> | null;

  warrantyMonths: number;
  warrantyTerms: string | null;

  isPublished: boolean;
  isActive: boolean;

  category: ProductCategoryRef | null;
  brand: ProductBrandRef | null;

  variants: ProductVariantDetail[];

  price: number;
  comparePrice: number | null;
  images: string[];
  totalStock: number;
  inStock: boolean;

  createdAt: string;
  updatedAt: string;

  relatedProducts?: RelatedProduct[];
};
