"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/hooks/useCart";
import { useAppSelector } from "@/store/hooks";
import { selectCartHydrated } from "@/store/selectors";

import Breadcrumb from "@/components/shared/Breadcrumb";
import { CartSkeleton } from "./cart-skeleton";
import { CartEmpty } from "./cart-empty";
import { CartHeader } from "./cart-header";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const { items, count, subtotal, remove, update, clear } = useCart();
  const hydrated = useAppSelector(selectCartHydrated);

  // SSR guard: never render persisted cart contents before mount.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !hydrated) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return <CartEmpty />;
  }

  /* ---------------- Remove (variant-based) ---------------- */
  const handleRemove = (variantId: string) => {
    const item = items.find((entry) => entry.variantId === variantId);
    remove(variantId);
    if (item) toast.success(`"${item.name}" removed from cart`);
  };

  /* ---------------- Update quantity (variant-based) ---------------- */
  const handleUpdateQuantity = (variantId: string, quantity: number) => {
    update(variantId, quantity);
  };

  /* ---------------- Clear ---------------- */
  const handleClear = () => {
    clear();
    toast.success("Cart cleared");
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <CartHeader itemCount={count} onClear={handleClear} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
        {/* Items list */}
        <section className="space-y-3 sm:space-y-4" aria-label="Cart items">
          {items.map((item) => (
            <CartItemRow
              key={item.variantId}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}
        </section>

        {/* Order Summary */}
        <CartSummary subtotal={subtotal} itemCount={count} />
      </div>
    </div>
  );
}