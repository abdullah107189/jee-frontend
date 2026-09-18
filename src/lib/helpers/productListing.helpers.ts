import { CartItemInput } from "../types/cart.types";
import { ProductCardData } from "../types/product.types";

export const PRODUCT_PAGE_SIZE = 10;

export const MAX_PRICE = 1_000_000;

type CountActiveFiltersParams = {
  categoryId: string | null;
  brandIds: string[];
  warrantyMonths: number[];
  priceRange: [number, number];
};

export function countActiveFilters({
  categoryId,
  brandIds,
  warrantyMonths,
  priceRange,
}: CountActiveFiltersParams) {
  return (
    (categoryId ? 1 : 0) +
    brandIds.length +
    warrantyMonths.length +
    (priceRange[0] > 0 ? 1 : 0) +
    (priceRange[1] < MAX_PRICE ? 1 : 0)
  );
}

export function getTotalPages(
  total: number,
  limit = PRODUCT_PAGE_SIZE,
): number {
  return Math.max(1, Math.ceil(total / limit));
}
export function toCartItem(
  card: {
    id: string;
    variantId: string;
    variantSku?: string | null;

    name: string;
    slug: string;

    price: number;
    comparePrice: number | null;

    image: string | null;

    warrantyMonths: number;
    stockQuantity: number;

    brandName: string | null;
    categoryName: string | null;
  },
  quantity = 1,
): CartItemInput {
  return {
    id: card.id,
    slug: card.slug,
    name: card.name,

    variantId: card.variantId,
    variantSku: card.variantSku ?? undefined,

    price: card.price,
    originalPrice: card.comparePrice ?? undefined,

    image: card.image,
    warrantyMonths: card.warrantyMonths,

    brand: card.brandName ?? undefined,
    category: card.categoryName ?? undefined,

    quantity,
    maxQuantity: card.stockQuantity || 1,
    stockQuantity: card.stockQuantity || 1,
  };
}
