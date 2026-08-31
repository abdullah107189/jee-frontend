export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductAttributes = Record<
  string,
  string | number | boolean | null
>;

export type ProductItemMetadata = Record<
  string,
  string | number | boolean | null
>;

export type Product = {
  id: string;
  name: string;
  slug: string;

  description: string | null;
  specifications: ProductSpecification[] | null;

  price: number;
  comparePrice: number | null;
  cost: number | null;

  discount: number | null;
  discountType: "PERCENTAGE" | "FIXED" | null;

  sku: string | null;

  warrantyMonths: number;
  warrantyTerms: string | null;

  stockQuantity: number;
  lowStockThreshold: number;

  images: string[] | null;
  attributes: ProductAttributes | null;

  isPublished: boolean;
  isActive: boolean;

  categoryId: string | null;
  brandId: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductItemStatus =
  | "AVAILABLE"
  | "SOLD"
  | "RESERVED"
  | "DAMAGED"
  | "RETURNED"
  | "UNDER_REPAIR";

export type ProductItem = {
  id: string;
  productId: string;

  uniqueId: string;
  serialNumber: string | null;

  status: ProductItemStatus;

  metadata: ProductItemMetadata | null;

  manufacturedAt: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  product: Product;

  relatedProducts?: ProductItem[];
};

//Product listing filter and pagination types
export type ProductFilters = {
  page?: number;
  limit?: number;

  search?: string;

  categoryId?: string;
  brandId?: string;

  minPrice?: number;
  maxPrice?: number;

  isPublished?: boolean;
  isActive?: boolean;

  status?: ProductItemStatus;
};

// api response types
export type ProductListResponse = {
  data: ProductItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
