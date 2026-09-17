"use client";

import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/store/slices/cartSlice";
import {
  selectCartCount,
  selectCartItems,
  selectCartHydrated,
  selectCartSubtotal,
} from "@/store/selectors";
import type { CartItemInput } from "@/lib/types/cart.types";

export function useCart() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const isHydrated = useAppSelector(selectCartHydrated);

  const add = useCallback(
    (item: CartItemInput) => dispatch(addToCart(item)),
    [dispatch],
  );

  const remove = useCallback(
    (id: string) => dispatch(removeFromCart(id)),
    [dispatch],
  );

  const update = useCallback(
    (id: string, quantity: number) =>
      dispatch(updateQuantity({ id, quantity })),
    [dispatch],
  );

  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);

  return { items, count, subtotal, add, remove, update, clear, isHydrated };
}
