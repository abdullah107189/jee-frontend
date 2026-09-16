/* -------------------------------------------------------------------------- */
/* CartItemInput — addToCart() call korar somoy                        */
/* -------------------------------------------------------------------------- */
export interface CartItemInput {
  /** Product id — display/link er jonno */
  id: string;
  slug: string;
  name: string;

  /** ✅ VARIANT id — stock + physical unit er jonno MUST */
  variantId: string;
  variantSku?: string;
  variantAttributes?: Record<string, string | number | boolean | null>;

  price: number;
  originalPrice?: number;

  image: string | null;
  warrantyMonths: number;

  /** Display names */
  brand?: string;
  category?: string;

  quantity?: number;
  /** variant.stockQuantity — max user ei quantity nite parbe */
  maxQuantity?: number;
  stockQuantity?: number;
}

/* -------------------------------------------------------------------------- */
/* CartItem — Redux state e ei shape                                     */
/* -------------------------------------------------------------------------- */
export interface CartItem {
  /** Product id */
  id: string;
  slug: string;
  name: string;

  /** ✅ VARIANT id — MUST */
  variantId: string;
  variantSku: string;

  /** Unit price (variant er) */
  price: number;
  originalPrice?: number;

  image: string | null;
  warrantyMonths: number;

  brand?: string;
  category?: string;

  /** Quantity user add korলো */
  quantity: number;
  /** variant er stock quantity = max */
  maxQuantity: number;
  /** variant er live stock */
  stockQuantity: number;
}

/* -------------------------------------------------------------------------- */
/* CartState                                                              */
/* -------------------------------------------------------------------------- */
export interface CartState {
  items: CartItem[];
  hydrated: boolean;
  lastUpdatedAt: number | null;
}

/* -------------------------------------------------------------------------- */
/* PersistedCart — redux-persist e ei shape save hoy                          */
/* -------------------------------------------------------------------------- */
export interface PersistedCart {
  items: CartItem[];
  lastUpdatedAt: number | null;

  _persist?: {
    version: number;
    rehydrated: boolean;
  };
}
