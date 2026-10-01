"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SummaryRow } from "./summary-row";
import { CartItem } from "@/lib/types/cart.types";


interface OrderSummaryProps {
    items: CartItem[];
    count: number;
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentPlan: "COD" | "FULL";
    insideDhaka: boolean;
    addressSelected: boolean;
}

export function OrderSummary({
    items,
    count,
    subtotal,
    deliveryFee,
    total,
    paymentPlan,
    insideDhaka,
    addressSelected,
}: OrderSummaryProps) {
    return (
        <Card className="overflow-hidden rounded-2xl lg:sticky lg:top-24">
            <CardContent className="p-0">
                {/* Header */}
                <div className="border-b border-border px-4 py-4 sm:px-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold">Order Summary</h3>
                        <Badge variant="default" className="rounded-full">
                            {count} {count === 1 ? "item" : "items"}
                        </Badge>
                    </div>
                </div>

                {/* Items */}
                <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                    {items.map((item) => (
                        <div key={item.variantId} className="flex gap-3">
                            {/* Image */}
                            <Link
                                href={`/products/${item.slug}`}
                                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                            >
                                <Image
                                    src={item.image || "/images/product-placeholder.png"}
                                    alt={item.name}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                />
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                                    {item.quantity}
                                </span>
                            </Link>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <Link
                                    href={`/products/${item.slug}`}
                                    className="line-clamp-2 text-xs font-medium leading-snug transition-colors hover:text-primary sm:text-sm"
                                >
                                    {item.name}
                                </Link>
                                <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                                    ৳{item.price.toLocaleString()} × {item.quantity}
                                </p>
                            </div>

                            {/* Subtotal */}
                            <div className="shrink-0 text-right">
                                <p className="text-xs font-semibold tabular-nums sm:text-sm">
                                    ৳{(item.price * item.quantity).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2.5 px-4 py-4 text-sm sm:px-5">
                    <SummaryRow label={`Subtotal (${count})`} value={subtotal} />

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            Delivery
                            {addressSelected && (
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "rounded-full text-[10px] font-normal",
                                        insideDhaka
                                            ? "border-emerald-500/30 text-emerald-600"
                                            : "text-muted-foreground",
                                    )}
                                >
                                    {insideDhaka ? "Inside Dhaka" : "Outside Dhaka District"}
                                </Badge>
                            )}
                        </span>
                        <span className="font-medium tabular-nums">
                            ৳{deliveryFee.toLocaleString()}
                        </span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between pt-1">
                        <span className="text-base font-bold">Total</span>
                        <span className="text-lg font-bold tabular-nums sm:text-xl">
                            ৳{total.toLocaleString()}
                        </span>
                    </div>

                    {paymentPlan === "FULL" && (
                        <p className="text-right text-xs text-muted-foreground">
                            Full payment — no cash on delivery.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}