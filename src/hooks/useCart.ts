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
  selectCartHydrated,
  selectCartItems,
  selectCartSubtotal,
} from "@/store/selectors";
import type { CartItemInput } from "@/lib/types/cart.types";

export function useCart() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const isHydrated = useAppSelector(selectCartHydrated);

  /* ✅ Check if variant already in cart */
  const has = useCallback(
    (variantId: string) => items.some((i) => i.variantId === variantId),
    [items],
  );

  /* ✅ Get existing quantity of a variant */
  const getQuantity = useCallback(
    (variantId: string) =>
      items.find((i) => i.variantId === variantId)?.quantity ?? 0,
    [items],
  );

  const add = useCallback(
    (item: CartItemInput) => dispatch(addToCart(item)),
    [dispatch],
  );

  const remove = useCallback(
    (variantId: string) => dispatch(removeFromCart(variantId)),
    [dispatch],
  );

  const update = useCallback(
    (variantId: string, quantity: number) =>
      dispatch(updateQuantity({ variantId, quantity })),
    [dispatch],
  );

  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);

  return {
    items,
    count,
    subtotal,
    isHydrated,
    has,
    getQuantity,
    add,
    remove,
    update,
    clear,
  };
}
