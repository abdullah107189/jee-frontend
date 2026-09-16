"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Tag, Truck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";

const DELIVERY_FEE = 100;
const FREE_DELIVERY_THRESHOLD = 5000;

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const router = useRouter();

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const delivery = isFreeDelivery ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <aside className="lg:sticky lg:top-24" aria-label="Order summary">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Tag className="h-4 w-4 text-primary" />
            Order Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 p-4 sm:p-5 lg:p-6">
          {/* Free delivery progress */}
          {!isFreeDelivery && (
            <div className="space-y-2 rounded-xl bg-muted/60 p-3 text-xs">
              <p className="font-medium">
                Add{" "}
                <span className="font-bold text-primary">
                  ৳{remainingForFree.toLocaleString()}
                </span>{" "}
                more to get{" "}
                <span className="font-bold text-emerald-600">
                  FREE delivery
                </span>
              </p>

              <div className="h-1.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotal / FREE_DELIVERY_THRESHOLD) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal ({itemCount})</span>
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
            <Button variant="outline" size="lg" className="w-full rounded-xl">
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
  );
}