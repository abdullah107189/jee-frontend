import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartHydrated = (state: RootState) => state.cart.hydrated;
/** Total number of physical units across all cart lines. */
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

/** Total price of all items, before delivery. */
export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

/** Backwards-compatible alias for callers that used `selectCartTotal`. */
export const selectCartTotal = selectCartSubtotal;

export const selectCartItemById = (id: string) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item.id === id),
  );
