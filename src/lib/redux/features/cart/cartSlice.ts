import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const getSavedCart = () => {
  try {
    const saved = localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  warrantyMonths: number;
  brand?: string;
  category?: string;
  maxQuantity?: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: getSavedCart() as CartItem[],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>
    ) => {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
      const qtyToAdd = action.payload.quantity || 1;
      if (existingIndex > -1) {
        state.items[existingIndex].quantity += qtyToAdd;
      } else {
        state.items.push({ ...action.payload, quantity: qtyToAdd });
      }
      localStorage.setItem('cart_items', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('cart_items', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      localStorage.setItem('cart_items', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart_items');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
