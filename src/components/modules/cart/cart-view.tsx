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
  console.log("CartView items:", items);
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

  const handleRemove = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    remove(id);
    if (item) toast.success(`"${item.name}" removed from cart`);
  };

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
              onUpdateQuantity={(id, quantity) => update(id, quantity)}
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
