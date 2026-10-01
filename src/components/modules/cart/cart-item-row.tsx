"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

import type { CartItem } from "@/lib/types/cart.types";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const canDecrement = item.quantity > 1;
  const canIncrement =
    item.maxQuantity == null || item.quantity < item.maxQuantity;
  const lineTotal = item.price * item.quantity;

  /* ✅ Toast remove hoye geche — parent (cart-view) e ache */
  const handleRemove = () => {
    onRemove(item.variantId);   // ✅ variantId
  };

  return (
    <Card className="overflow-hidden border-border/60 transition-shadow hover:shadow-md">
      <CardContent className="p-3 sm:p-4 lg:p-5">
        <div className="flex gap-3 sm:gap-4">
          {/* Image */}
          <Link
            href={`/products/${item.slug}`}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:h-24 sm:w-24 lg:h-28 lg:w-28"
          >
            <Image
              src={item.image || "/placeholder.png"}
              alt={item.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.slug}`} className="group">
                  <h2 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary sm:text-base">
                    {item.name}
                  </h2>
                </Link>

                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="gap-1 text-[10px] font-normal sm:text-xs"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {item.warrantyMonths} mo warranty
                  </Badge>
                </div>
              </div>

              {/* Desktop subtotal */}
              <div className="hidden shrink-0 text-right lg:block">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Subtotal
                </p>
                <p className="mt-0.5 font-semibold tabular-nums">
                  ৳{lineTotal.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Unit price */}
            <div className="mt-2">
              <span className="text-sm font-bold tabular-nums sm:text-base">
                ৳{item.price.toLocaleString()}
              </span>
              <span className="ml-1 text-[10px] text-muted-foreground sm:text-xs">
                / unit
              </span>
            </div>

            {/* Controls */}
            <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
              <div className="inline-flex items-center rounded-lg border border-border bg-background">
                {/* Decrease — ✅ variantId */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-r-none hover:bg-accent sm:h-9 sm:w-9"
                  onClick={() =>
                    onUpdateQuantity(item.variantId, item.quantity - 1)
                  }
                  disabled={!canDecrement}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>

                <span
                  className="flex h-8 min-w-8 items-center justify-center border-x border-border px-2 text-sm font-semibold tabular-nums sm:h-9 sm:min-w-10"
                  aria-live="polite"
                >
                  {item.quantity}
                </span>

                {/* Increase — ✅ variantId */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-l-none hover:bg-accent sm:h-9 sm:w-9"
                  onClick={() =>
                    onUpdateQuantity(item.variantId, item.quantity + 1)
                  }
                  disabled={!canIncrement}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Remove — ✅ variantId (via handleRemove) */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8 gap-1.5 px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:px-3"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Remove</span>
              </Button>
            </div>

            {/* Mobile/tablet total */}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 lg:hidden">
              <span className="text-xs text-muted-foreground">Item total</span>
              <span className="text-sm font-bold tabular-nums">
                ৳{lineTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}