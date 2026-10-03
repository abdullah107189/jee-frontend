// lib/types/admin.types.ts
// Admin-only types — product, list, detail, variant items

/* -------------------------------------------------------------------------- */
/* Admin Product List                                                         */
/* -------------------------------------------------------------------------- */
export type AdminProductListItem = {
  id: string;
  name: string;
  slug: string;
  variantId: string;
  variantSku: string | null;
  price: number;
  comparePrice: number | null;
  image: string | null;
  warrantyMonths: number;
  stockQuantity: number;
  brandName: string | null;
  categoryName: string | null;
};

export type AdminProductListResponse = {
  success: boolean;
  message?: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  data: AdminProductListItem[];
};

/* -------------------------------------------------------------------------- */
/* Admin Product Detail (variants + items)                                    */
/* -------------------------------------------------------------------------- */
export type AdminProductItemSummary = {
  id: string;
  variantId: string;
  serialNumber: string;
  status:
    | "AVAILABLE"
    | "RESERVED"
    | "SOLD"
    | "DAMAGED"
    | "RETURNED"
    | "UNDER_REPAIR";
};

export type AdminProductVariant = {
  id: string;
  sku: string;
  attributes: Record<string, string | number | boolean | null>;
  price: string | number; // backend string dey — frontend Number() koro
  comparePrice: string | number | null;
  images: string[];
  isDefault: boolean;
  stockQuantity: number;
  productItems: AdminProductItemSummary[];
};

export type AdminProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specifications: Record<string, string> | null;
  warrantyMonths: number;
  warrantyTerms: string | null;
  isPublished: boolean;
  isActive: boolean;
  categoryId: string;
  brandId: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string; logo: string | null } | null;
  variants: AdminProductVariant[];
};

/* -------------------------------------------------------------------------- */
/* Variant Items (single fetch — list page)                                   */
/* -------------------------------------------------------------------------- */
export type VariantItem = AdminProductItemSummary & {
  metadata: Record<string, unknown> | null;
  manufacturedAt: string | null;
  createdAt: string;
};

export type VariantItemsResponse = {
  variant: { id: string; sku: string; productId: string };
  items: VariantItem[];
};

export type AdminVariantDetail = {
  id: string;
  sku: string;
  attributes: Record<string, string | number | boolean | null>;
  price: string | number;
  comparePrice: string | number | null;
  images: string[];
  isDefault: boolean;
  stockQuantity: number;
  isActive: boolean;
  product: { id: string; name: string; slug: string };
  productItems: VariantItem[];
};

/* ─────────── Dropdown options ─────────── */
export type CategoryFlat = {
  id: string;
  name: string;
  slug: string;
  fullSlug: string;
  level: number;
  productCount: number;
  isActive: boolean;
};

export type BrandOption = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
};

/* ─────────── Create product payload ─────────── */
export type CreateVariantInput = {
  sku?: string;
  attributes: Record<string, string>;
  price: number;
  comparePrice?: number;
  images: string[];
  stockQuantity: number;
  lowStockThreshold?: number;
  isActive: boolean;
};

export type CreateProductInput = {
  name: string;
  slug?: string;
  description?: string;
  specifications?: Record<string, string>;
  warrantyMonths: number;
  warrantyTerms?: string;
  categoryId: string;
  brandId?: string;
  isPublished: boolean;
  isActive: boolean;
  variants: CreateVariantInput[];
};