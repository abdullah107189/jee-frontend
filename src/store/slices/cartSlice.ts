import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  stockQuantity: number;
  warrantyMonths: number;
  brand?: string;
  category?: string;
  maxQuantity?: number;
}

interface CartState {
  items: CartItem[];
  hydrated: boolean;
}

const initialState: CartState = {
  items: [],
  hydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.hydrated = true;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;

      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        const requestedQuantity =
          existingItem.stockQuantity + newItem.stockQuantity;

        if (existingItem.maxQuantity != null) {
          existingItem.stockQuantity = Math.min(
            requestedQuantity,
            existingItem.maxQuantity,
          );
        } else {
          existingItem.stockQuantity = requestedQuantity;
        }

        return;
      }

      state.items.push({
        ...newItem,
        stockQuantity: Math.min(
          newItem.stockQuantity || 1,
          newItem.maxQuantity ?? Infinity,
        ),
      });
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateStockQuantity: (
      state,
      action: PayloadAction<{ id: string; StockQuantity: number }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (!item) return;

      const requestedQuantity = action.payload?.StockQuantity;

      // Minimum StockQuantity = 1
      if (requestedQuantity < 1) {
        item.stockQuantity = 1;
        return;
      }

      // Maximum stock protection
      if (item.maxQuantity != null && requestedQuantity > item.maxQuantity) {
        item.stockQuantity = item.maxQuantity;
        return;
      }

      item.stockQuantity = requestedQuantity;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateStockQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
