import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CartItemInput,
  CartItem,
  CartState,
} from "@/lib/types/cart.types";

const initialState: CartState = {
  items: [],
  hydrated: false,
  lastUpdatedAt: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ---------------- Add to cart ---------------- */
    addToCart: {
      reducer(state, action: PayloadAction<CartItem>) {
        const incoming = action.payload;

        const existing = state.items.find(
          (item) => item.variantId === incoming.variantId,
        );

        if (existing) {
          const nextQty = Math.min(
            existing.quantity + incoming.quantity,
            incoming.maxQuantity,
          );
          existing.quantity = nextQty;
          existing.price = incoming.price;
          existing.originalPrice = incoming.originalPrice;
          existing.image = incoming.image ?? existing.image;
          existing.stockQuantity = incoming.stockQuantity;
          existing.maxQuantity = incoming.maxQuantity;
        } else {
          state.items.push(incoming);
        }

        state.lastUpdatedAt = Date.now();
      },
      /* ✅ prepare — defaults handle koro */
      prepare(input: CartItemInput) {
        const quantity = Math.max(1, input.quantity ?? 1);
        const stockQuantity = Math.max(1, input.stockQuantity ?? 1);
        const maxQuantity = Math.max(1, input.maxQuantity ?? stockQuantity);

        const item: CartItem = {
          id: input.id,
          slug: input.slug,
          name: input.name,

          variantId: input.variantId,
          variantSku: input.variantSku ?? "",

          price: input.price,
          originalPrice: input.originalPrice,

          image: input.image,
          warrantyMonths: input.warrantyMonths,

          brand: input.brand,
          category: input.category,

          quantity: Math.min(quantity, maxQuantity),
          maxQuantity,
          stockQuantity,
        };

        return { payload: item };
      },
    },

    /* ---------------- Remove ---------------- */
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.lastUpdatedAt = Date.now();
    },

    /* ---------------- Update quantity ---------------- */
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (!item) return;

      item.quantity = Math.max(1, Math.min(quantity, item.maxQuantity));
      state.lastUpdatedAt = Date.now();
    },

    /* ---------------- Clear ---------------- */
    clearCart(state) {
      state.items = [];
      state.lastUpdatedAt = Date.now();
    },

    /* ---------------- Hydrate ---------------- */
    setHydrated(state, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },

    replaceCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.lastUpdatedAt = Date.now();
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setHydrated,
  replaceCart,
} = cartSlice.actions;

export default cartSlice.reducer;
