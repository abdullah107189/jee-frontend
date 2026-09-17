"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCart } from "./useCart";
import type { ProductCardData } from "@/lib/types/product.types";
import { toCartItem } from "@/lib/helpers/productListing.helpers";

/**
 * Simple add-to-cart hook for product cards.
 * Handles duplicate check + toast automatically.
 */
export function useAddToCart() {
  const router = useRouter();
  const { add, has } = useCart();

  return useCallback(
    (product: ProductCardData) => {
      // Duplicate check
      if (product.variantId && has(product.variantId)) {
        toast.warning(`"${product.name}" already in your cart`, {
          description: "Manage quantity from cart page.",
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        });
        return;
      }

      // Add
      add(toCartItem(product));
      toast.success(`"${product.name}" added to cart`);
    },
    [add, has, router],
  );
}
