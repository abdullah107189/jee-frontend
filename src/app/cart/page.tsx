"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/components/layout/MainLayout";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart, removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import type { CartItem } from "@/store/slices/cartSlice";

const DELIVERY_FEE = 100;

export default function CartPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items) as CartItem[];
  const isLoading = useAppSelector((state) => !state.cart.hydrated);
  const isUpdating = false;
  const isRemoving = false;
  const isClearing = false;

  const { subtotal, itemCount, total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      itemCount,
      total: subtotal + DELIVERY_FEE,
    };
  }, [items]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      dispatch(removeFromCart(id));

      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      dispatch(clearCart());

      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  /* ---------------- Loading ---------------- */

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <CartHeaderSkeleton />

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <CartItemSkeleton key={item} />
              ))}
            </div>

            <SummarySkeleton />
          </div>
        </div>
      </MainLayout>
    );
  }

  /* ---------------- Empty Cart ---------------- */

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-9 w-9 text-muted-foreground" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Your cart is empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Looks like you haven&apos;t added anything to your cart yet. Start
              shopping and find something you&apos;ll love.
            </p>

            <Link href="/products">
              <Button size="lg" className="mt-7 w-full sm:w-auto">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  /* ---------------- Cart ---------------- */

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Shopping Cart
              </h1>

              <Badge variant="outline">{itemCount}</Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Review your items before checkout.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            disabled={isClearing}
            className="w-fit text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isClearing ? "Clearing..." : "Clear cart"}
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Cart Items */}
          <section className="space-y-4">
            {items.map((item) => {
              const canIncrement =
                item.maxQuantity == null || item.quantity < item.maxQuantity;

              return (
                <Card
                  key={item.id}
                  className="overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-4 sm:gap-5">
                      {/* Image */}
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted sm:h-32 sm:w-32"
                      >
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 96px, 128px"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </Link>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.slug}`}
                              className="group"
                            >
                              <h2 className="line-clamp-2 text-sm font-semibold leading-5 transition-colors group-hover:text-primary sm:text-base">
                                {item.name}
                              </h2>
                            </Link>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs font-normal"
                              >
                                {item.warrantyMonths} months warranty
                              </Badge>
                            </div>
                          </div>

                          {/* Desktop price */}
                          <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-xs text-muted-foreground">
                              Total
                            </p>

                            <p className="mt-0.5 font-semibold">
                              ৳{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-3">
                          <span className="text-base font-bold sm:text-lg">
                            ৳{item.price.toLocaleString()}
                          </span>

                          <span className="ml-1 text-xs text-muted-foreground">
                            / item
                          </span>
                        </div>

                        {/* Bottom controls */}
                        <div className="mt-4 flex items-center justify-between gap-3">
                          {/* Quantity */}
                          <div className="flex items-center rounded-md border bg-background">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={isUpdating || item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>

                            <span className="flex h-8 min-w-9 items-center justify-center border-x px-2 text-sm font-medium">
                              {item.quantity}
                            </span>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={isUpdating || !canIncrement}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          {/* Remove */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isRemoving}
                            className="h-8 px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="mr-1.5 h-4 w-4" />
                            <span className="hidden xs:inline">Remove</span>
                          </Button>
                        </div>

                        {/* Mobile total */}
                        <div className="mt-3 flex items-center justify-between border-t pt-3 sm:hidden">
                          <span className="text-xs text-muted-foreground">
                            Item total
                          </span>

                          <span className="font-semibold">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* Summary */}
          <aside className="lg:sticky lg:top-6">
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="p-5 sm:p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>

                    <span className="font-medium">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>

                    <span className="font-medium">
                      ৳{DELIVERY_FEE.toLocaleString()}
                    </span>
                  </div>

                  <div className="my-4 border-t" />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>

                    <span className="text-xl font-bold tracking-tight">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="mt-6 flex gap-3 rounded-lg border bg-muted/40 p-3.5">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">Delivery available</p>

                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      Standard delivery fee is ৳{DELIVERY_FEE.toLocaleString()}.
                    </p>
                  </div>
                </div>

                {/* Checkout */}
                <Button
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => router.push("/customer/checkout")}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Link href="/products">
                  <Button variant="outline" size="lg" className="mt-2 w-full">
                    Continue Shopping
                  </Button>
                </Link>

                <p className="mt-4 text-center text-[11px] leading-4 text-muted-foreground">
                  Taxes and final delivery details will be confirmed at
                  checkout.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeletons                                                                  */
/* -------------------------------------------------------------------------- */

function CartHeaderSkeleton() {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Skeleton className="h-9 w-24" />
    </div>
  );
}

function CartItemSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-4">
          <Skeleton className="h-24 w-24 shrink-0 rounded-lg sm:h-32 sm:w-32" />

          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-20" />

            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummarySkeleton() {
  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <Skeleton className="h-6 w-32" />

        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          <Skeleton className="h-px w-full" />

          <div className="flex justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </CardContent>
    </Card>
  );
}
