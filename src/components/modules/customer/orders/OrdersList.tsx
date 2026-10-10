"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Search,
  X,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
} from "lucide-react";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types/order.types";

interface OrdersListProps {
  orders: Order[];
  total?: number;
  initialStatus?: string;
  initialSearch?: string;
}

const statusBadgeVariant = (status: OrderStatus | string): "default" | "success" | "warning" | "destructive" | "outline" => {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
      return "success";
    case "PENDING":
      return "warning";
    case "CONFIRMED":
    case "PROCESSING":
    case "SHIPPED":
      return "default";
    case "CANCELLED":
    case "RETURNED":
      return "destructive";
    default:
      return "outline";
  }
};

const paymentBadgeVariant = (status: PaymentStatus | string): "default" | "success" | "warning" | "destructive" | "outline" => {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "success";
    case "SUBMITTED":
      return "default";
    case "PENDING":
      return "warning";
    case "REJECTED":
    case "REFUNDED":
      return "destructive";
    default:
      return "outline";
  }
};

const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function OrdersList({
  orders,
  initialStatus = "all",
  initialSearch = "",
}: OrdersListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const applyFilters = (newSearch: string, newStatus: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    } else {
      params.delete("search");
    }

    if (newStatus && newStatus !== "all") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }

    params.delete("page");

    startTransition(() => {
      router.push(`/customer/orders?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(searchTerm, statusFilter);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    applyFilters(searchTerm, val);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    applyFilters("", "all");
  };

  // Client-side fallback filter if Server Component returned un-filtered array
  const displayOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ||
      order.status?.toUpperCase() === statusFilter.toUpperCase();

    if (!matchesStatus) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();

    const matchesNumber = order.orderNumber?.toLowerCase().includes(term);
    const matchesItem = order.items?.some((item) => {
      const name = item.name || item.variant?.product?.name;
      return name?.toLowerCase().includes(term);
    });

    return matchesNumber || matchesItem;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order # or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-9 bg-card border-border"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                applyFilters("", statusFilter);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[190px] bg-card border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading state overlay during URL transitions */}
      {isPending && (
        <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 animate-spin mr-1.5" />
          Updating orders...
        </div>
      )}

      {/* Orders List */}
      {displayOrders.length === 0 ? (
        <Card className="border border-border bg-card">
          <CardContent className="text-center py-14 px-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold mb-1">
              {searchTerm || statusFilter !== "all"
                ? "No matching orders found"
                : "No orders yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              {searchTerm || statusFilter !== "all"
                ? "We couldn't find any orders matching your search or filter criteria. Try resetting filters."
                : "Your order history is empty. Start shopping our genuine electronics with serial-backed warranty."}
            </p>
            {searchTerm || statusFilter !== "all" ? (
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Link href="/products">
                <Button className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Explore Products
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order) => {
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A";

            const totalItemCount = order.items?.reduce(
              (acc, item) => acc + (item.quantity || 1),
              0,
            ) || order.items?.length || 0;

            return (
              <Card
                key={order.id}
                className="overflow-hidden border border-border bg-card transition-all hover:shadow-md"
              >
                <CardContent className="p-5 sm:p-6">
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-base font-bold text-foreground">
                          Order #{order.orderNumber}
                        </span>
                        <Badge variant={statusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                        {order.paymentStatus && (
                          <Badge variant={paymentBadgeVariant(order.paymentStatus)}>
                            Payment: {order.paymentStatus}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Placed on {formattedDate} • Payment: {order.paymentWay || "COD"}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-black tabular-nums text-foreground">
                        ৳{order.total?.toLocaleString() ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="space-y-3 mb-5">
                    {order.items?.map((item) => {
                      const itemName =
                        item.name ||
                        item.variant?.product?.name ||
                        "Product Item";
                      const itemImg =
                        item.image ||
                        item.variant?.product?.images?.[0];
                      const itemPrice = item.price || item.unitPrice || 0;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 text-sm py-1"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                              {itemImg ? (
                                <Image
                                  src={itemImg}
                                  alt={itemName}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate text-foreground">
                                {itemName}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span>Qty: {item.quantity}</span>
                                {item.variant?.color && (
                                  <span>• Color: {item.variant.color}</span>
                                )}
                                {item.variant?.size && (
                                  <span>• Size: {item.variant.size}</span>
                                )}
                                {item.serialNumber && (
                                  <span className="font-mono">
                                    • SN: {item.serialNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="font-semibold tabular-nums text-foreground">
                              ৳{(itemPrice * (item.quantity || 1)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{totalItemCount} item(s) total</span>
                      {order.shippingAddress?.districtName && (
                        <span>
                          • Deliver to: {order.shippingAddress.districtName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Link href={`/customer/orders/${order.id}`}>
                        <Button variant="default" size="sm" className="gap-1.5">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}