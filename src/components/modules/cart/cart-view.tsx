"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCart,
  removeFromCart,
  updateStockQuantity,
  type CartItem,
} from "@/store/slices/cartSlice";
import Breadcrumb from "@/components/shared/Breadcrumb";

const DELIVERY_FEE = 100;
const FREE_DELIVERY_THRESHOLD = 5000;

export function CartView() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const items = useAppSelector((s) => s.cart.items) as CartItem[];

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isClearing, startClearTransition] = useTransition();

  /* --------------------------- Derived totals --------------------------- */
  const { subtotal, itemCount, delivery, total, remainingForFree } =
    useMemo(() => {
      const subtotal = items.reduce(
        (sum, i) => sum + i.price * i.stockQuantity,
        0,
      );
      const itemCount = items.reduce((sum, i) => sum + i.stockQuantity, 0);
      const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
      const delivery = isFreeDelivery ? 0 : DELIVERY_FEE;

      return {
        subtotal,
        itemCount,
        delivery,
        total: subtotal + delivery,
        remainingForFree: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
      };
    }, [items]);

  /* ------------------------------- Actions ------------------------------ */
  const handleUpdateStockQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setPendingId(id);
    try {
      dispatch(updateStockQuantity({ id, StockQuantity: newQty }));
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setPendingId(null);
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    setPendingId(id);
    try {
      dispatch(removeFromCart(id));
      toast.success(`"${name}" removed from cart`);
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setPendingId(null);
    }
  };

  const handleClearCart = () => {
    startClearTransition(() => {
      try {
        dispatch(clearCart());
        toast.success("Cart cleared");
      } catch {
        toast.error("Failed to clear cart");
      }
    });
  };

  /* --------------------------- Empty state ------------------------------ */
  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-9 w-9 text-primary" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Looks like you haven&apos;t added anything yet. Start exploring and
            find something you love.
          </p>

          <Link href="/products">
            <Button size="lg" className="mt-7 w-full rounded-xl sm:w-auto">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ------------------------------ Main cart ---------------------------- */
  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Shopping Cart
            </h1>
            <Badge variant="destructive" className="rounded-full">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your items before checkout.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="ghost"
              size="sm"
              disabled={isClearing}
              className="w-fit text-muted-foreground hover:text-destructive"
            >
              {isClearing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Clear cart
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all {itemCount} item
                {itemCount !== 1 && "s"} from your cart. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearCart}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, clear cart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      {/* Grid */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
        {/* Items list */}
        <section className="space-y-3 sm:space-y-4" aria-label="Cart items">
          {items.map((item) => {
            const canIncrement =
              item.maxQuantity == null || item.stockQuantity < item.maxQuantity;
            const isThisPending = pendingId === item.id;

            return (
              <Card
                key={item.id}
                className="overflow-hidden border-border/60 transition-shadow hover:shadow-md"
              >
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
                          <Link
                            href={`/products/${item.slug}`}
                            className="group"
                          >
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
                            ৳
                            {(item.price * item.stockQuantity).toLocaleString()}
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none hover:bg-accent sm:h-9 sm:w-9"
                            onClick={() =>
                              handleUpdateStockQuantity(
                                item.id,
                                item.stockQuantity - 1,
                              )
                            }
                            disabled={isThisPending || item.stockQuantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>

                          <span
                            className="flex h-8 min-w-8 items-center justify-center border-x border-border px-2 text-sm font-semibold tabular-nums sm:h-9 sm:min-w-10"
                            aria-live="polite"
                          >
                            {isThisPending ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              item.stockQuantity
                            )}
                          </span>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none hover:bg-accent sm:h-9 sm:w-9"
                            onClick={() =>
                              handleUpdateStockQuantity(
                                item.id,
                                item.stockQuantity + 1,
                              )
                            }
                            disabled={isThisPending || !canIncrement}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          disabled={isThisPending}
                          className="h-8 gap-1.5 px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:px-3"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden xs:inline sm:inline">
                            Remove
                          </span>
                        </Button>
                      </div>

                      {/* Mobile/tablet total */}
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 lg:hidden">
                        <span className="text-xs text-muted-foreground">
                          Item total
                        </span>
                        <span className="text-sm font-bold tabular-nums">
                          ৳{(item.price * item.stockQuantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Order Summary */}
        <aside className="lg:sticky lg:top-24" aria-label="Order summary">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Tag className="h-4 w-4 text-primary" />
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 p-4 sm:p-5 lg:p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount})
                  </span>
                  <span className="font-medium tabular-nums">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  {delivery === 0 ? (
                    <span className="font-semibold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-medium tabular-nums">
                      ৳{delivery.toLocaleString()}
                    </span>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold tabular-nums sm:text-xl">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
                onClick={() => router.push("/customer/checkout")}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-xl"
                >
                  Continue Shopping
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-4 pt-1 text-[10px] text-muted-foreground sm:text-xs">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Secure
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Fast delivery
                </span>
              </div>

              <p className="text-center text-[10px] leading-4 text-muted-foreground sm:text-[11px]">
                Taxes and final delivery details will be confirmed at checkout.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
