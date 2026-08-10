// lib/types/cart.types.ts

export interface CartItem {
  id: string;
  productItemId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  warrantyMonths: number;
  maxQuantity: number;
}

export interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    itemCount: number;
  };
}

export interface AddToCartRequest {
  productItemId: string;
  quantity?: number;
}

export interface UpdateCartRequest {
  id: string;
  quantity: number;
}