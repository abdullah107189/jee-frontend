// app/(dashboard)/customer/cart/page.tsx

"use client";

import { useState } from "react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import {
  useClearCartItemsMutation,
  useGetCartItemsQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemQtyMutation,
} from "@/lib/redux/features/cart/cartApi";
import type { CartItem } from "@/lib/redux/features/cart/cartSlice";
import { toast } from "sonner";
import Image from "next/image";

export default function CartPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useGetCartItemsQuery();
  const [updateItem, { isLoading: isUpdating }] =
    useUpdateCartItemQtyMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartItemsMutation();

  const items = (data ?? []) as CartItem[];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const total = subtotal - discount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Update quantity
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateItem({ id, quantity: newQuantity }).unwrap();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update quantity");
    }
  };

  // Remove item
  const handleRemoveItem = async (id: string) => {
    try {
      await removeItem(id).unwrap();
      refetch();
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error("Failed to remove item");
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      refetch();
      toast.success("All items removed from cart");
    } catch (error: any) {
      toast.error("Failed to clear cart");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-12" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty cart
  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Start shopping to add items to your cart
        </p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Shopping Cart ({itemCount} items)
        </h1>
        <Button
          variant="outline"
          onClick={handleClearCart}
          disabled={isClearing}
        >
          {isClearing ? "Clearing..." : "Clear Cart"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            (() => {
              const canIncrement = item.maxQuantity == null || item.quantity < item.maxQuantity;

              return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {item.warrantyMonths} months warranty
                      </Badge>
                    </div>
                    <p className="text-lg font-bold mt-1">
                      ৳{item.price.toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={isUpdating || !canIncrement}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isRemoving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
              );
            })()
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>৳100</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>৳{(total + 100).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => router.push("/customer/checkout")}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Link href="/products">
                <Button variant="outline" className="w-full mt-2">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
