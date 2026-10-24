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
  Search,
  X,
  Eye,
  Package,
  ShoppingBag,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Phone,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "@/actions/order.actions";
import { OrderStatusConfirmDialog } from "@/components/modules/admin/orders/OrderStatusConfirmDialog";
import {
  getValidNextStatuses,
  getOrderStatusBadgeVariant,
  ORDER_STATUS_LABELS,
} from "@/lib/constants/orderStatus";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types/order.types";

interface AdminOrdersListProps {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  initialStatus?: string;
  initialSearch?: string;
}

const statusBadgeVariant = (
  status: OrderStatus | string,
): "default" | "success" | "warning" | "destructive" | "outline" => {
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

const paymentBadgeVariant = (
  status: PaymentStatus | string,
): "default" | "success" | "warning" | "destructive" | "outline" => {
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
  { value: "all", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "RETURNED", label: "ডেলিভারি ব্যর্থ/ফেরত" },
];

export function AdminOrdersList({
  orders,
  total,
  page,
  totalPages,
  initialStatus = "all",
  initialSearch = "",
}: AdminOrdersListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const [confirmDialogState, setConfirmDialogState] = useState<{
    open: boolean;
    order: Order | null;
    targetStatus: OrderStatus | null;
  }>({
    open: false,
    order: null,
    targetStatus: null,
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChangeRequest = async (
    order: Order,
    nextStatus: OrderStatus,
  ) => {
    if (nextStatus === "PROCESSING") {
      toast.info("অর্ডার প্যাকিং ও পণ্যের সিরিয়াল নম্বর স্ক্যান করতে অর্ডার ডিটেইলসে প্রবেশ করুন।");
      router.push(`/admin/orders/${order.id}`);
      return;
    }

    if (nextStatus === "SHIPPED") {
      toast.info("কুরিয়ার সার্ভিস ও ট্র্যাকিং নম্বর ইনপুট করতে অর্ডার ডিটেইলসে প্রবেশ করুন।");
      router.push(`/admin/orders/${order.id}`);
      return;
    }

    if (["DELIVERED", "RETURNED", "CANCELLED"].includes(nextStatus)) {
      setConfirmDialogState({
        open: true,
        order,
        targetStatus: nextStatus,
      });
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const res = await updateOrderStatusAction(order.id, nextStatus);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmStatusChange = async (reason?: string) => {
    if (!confirmDialogState.order || !confirmDialogState.targetStatus) return;
    setIsUpdatingStatus(true);
    try {
      const res = await updateOrderStatusAction(
        confirmDialogState.order.id,
        confirmDialogState.targetStatus,
        reason,
      );
      if (res.success) {
        toast.success(res.message);
        setConfirmDialogState({ open: false, order: null, targetStatus: null });
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const applyFilters = (newSearch: string, newStatus: string, newPage = 1) => {
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

    if (newPage > 1) {
      params.set("page", String(newPage));
    } else {
      params.delete("page");
    }

    startTransition(() => {
      router.push(`/admin/orders?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(searchTerm, statusFilter, 1);
  };

  const handleStatusChange = (val: string | null) => {
    const nextStatus = val ?? "all";
    setStatusFilter(nextStatus);
    applyFilters(searchTerm, nextStatus, 1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    applyFilters("", "all", 1);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order #, customer name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-9 bg-card border-border h-11"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                applyFilters("", statusFilter, 1);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[200px] bg-card border-border h-11">
            <Filter className="h-4 w-4 mr-1.5 text-muted-foreground" />
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

      {/* Loading indicator */}
      {isPending && (
        <div className="flex items-center justify-center py-2 text-xs text-muted-foreground animate-pulse">
          <Clock className="h-3.5 w-3.5 animate-spin mr-1.5 text-primary" />
          Updating orders...
        </div>
      )}

      {/* Orders Content */}
      {orders.length === 0 ? (
        <Card className="border border-border bg-card">
          <CardContent className="text-center py-16 px-4">
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
                ? "Try adjusting your search query or status filter to find orders."
                : "Customer online orders and POS transactions will appear here."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* 🖥️ DESKTOP & TABLET VIEW: Rich Table with Product Images */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Order</th>
                    <th className="px-5 py-4 font-semibold">Product(s)</th>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Total</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.map((order) => {
                    const formattedDate = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A";

                    const customerName =
                      order.customer?.name ||
                      order.customerName ||
                      order.shippingAddress?.fullName ||
                      "Walk-in Customer";
                    const customerPhone =
                      order.customer?.phone ||
                      order.customerPhone ||
                      order.shippingAddress?.phone ||
                      "";

                    // Items & Image Extraction
                    const firstItem = order.items?.[0];
                    const firstItemImage =
                      firstItem?.image ||
                      firstItem?.variant?.image ||
                      firstItem?.variant?.product?.images?.[0] ||
                      firstItem?.product?.images?.[0];
                    const firstItemName =
                      firstItem?.name ||
                      firstItem?.variant?.product?.name ||
                      firstItem?.product?.name ||
                      "Product Item";
                    const totalItemsCount =
                      order.itemCount ||
                      order.items?.reduce((acc, i) => acc + (i.quantity || 1), 0) ||
                      order.items?.length ||
                      1;

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Order & Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                            #{order.orderNumber}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {formattedDate}
                          </p>
                        </td>

                        {/* Product Image & Info */}
                        <td className="px-5 py-4 min-w-[220px]">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 rounded-xl bg-muted overflow-hidden border border-border/60 flex items-center justify-center">
                              {firstItemImage ? (
                                <Image
                                  src={firstItemImage}
                                  alt={firstItemName}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate max-w-[180px]">
                                {firstItemName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {totalItemsCount > 1
                                  ? `+${totalItemsCount - 1} more item(s)`
                                  : `Qty: ${firstItem?.quantity || 1}`}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4 min-w-[160px]">
                          <p className="font-semibold text-foreground">{customerName}</p>
                          {customerPhone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone className="h-3 w-3" />
                              {customerPhone}
                            </p>
                          )}
                        </td>

                        {/* Total Amount */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="font-black tabular-nums text-foreground">
                            ৳{(order.total ?? 0).toLocaleString()}
                          </p>
                          <Badge
                            variant={paymentBadgeVariant(order.paymentStatus)}
                            className="mt-1 text-[10px]"
                          >
                            {order.paymentStatus || order.paymentWay || "PENDING"}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1.5 items-start">
                            <Badge variant={statusBadgeVariant(order.status)}>
                              {order.status === "RETURNED"
                                ? "ডেলিভারি ব্যর্থ/ফেরত"
                                : order.status}
                            </Badge>
                            {(() => {
                              const validNext = getValidNextStatuses(order.status);
                              if (validNext.length === 0) return null;
                              return (
                                <Select
                                  value=""
                                  onValueChange={(val) => {
                                    if (val) {
                                      handleStatusChangeRequest(order, val as OrderStatus);
                                    }
                                  }}
                                  disabled={isUpdatingStatus}
                                >
                                  <SelectTrigger className="h-7 text-xs px-2 w-[140px] bg-background border-border">
                                    <SelectValue placeholder="Next step..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {validNext.map((st) => (
                                      <SelectItem key={st} value={st} className="text-xs">
                                        {ORDER_STATUS_LABELS[st] ?? st}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              );
                            })()}
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <Eye className="h-4 w-4" />
                              Manage
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border px-5 py-4 bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  Showing Page <span className="font-semibold text-foreground">{page}</span> of{" "}
                  <span className="font-semibold text-foreground">{totalPages}</span> ({total} orders)
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => applyFilters(searchTerm, statusFilter, page - 1)}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => applyFilters(searchTerm, statusFilter, page + 1)}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 📱 MOBILE VIEW: Beautiful Responsive Card Layout with Images */}
          <div className="block md:hidden space-y-4">
            {orders.map((order) => {
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A";

              const customerName =
                order.customer?.name ||
                order.customerName ||
                order.shippingAddress?.fullName ||
                "Customer";
              const customerPhone =
                order.customer?.phone ||
                order.customerPhone ||
                order.shippingAddress?.phone ||
                "";

              const firstItem = order.items?.[0];
              const firstItemImage =
                firstItem?.image ||
                firstItem?.variant?.image ||
                firstItem?.variant?.product?.images?.[0] ||
                firstItem?.product?.images?.[0];
              const firstItemName =
                firstItem?.name ||
                firstItem?.variant?.product?.name ||
                firstItem?.product?.name ||
                "Product Item";
              const totalItemsCount =
                order.itemCount ||
                order.items?.reduce((acc, i) => acc + (i.quantity || 1), 0) ||
                order.items?.length ||
                1;

              return (
                <Card
                  key={order.id}
                  className="overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 sm:p-5 space-y-4">
                    {/* Top Row: Order # and Status */}
                    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                      <div>
                        <span className="font-mono text-sm font-bold text-foreground">
                          #{order.orderNumber}
                        </span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {formattedDate}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={statusBadgeVariant(order.status)} className="text-[11px]">
                          {order.status === "RETURNED"
                            ? "ডেলিভারি ব্যর্থ/ফেরত"
                            : order.status}
                        </Badge>
                        {(() => {
                          const validNext = getValidNextStatuses(order.status);
                          if (validNext.length === 0) return null;
                          return (
                            <Select
                              value=""
                              onValueChange={(val) => {
                                if (val) {
                                  handleStatusChangeRequest(order, val as OrderStatus);
                                }
                              }}
                              disabled={isUpdatingStatus}
                            >
                              <SelectTrigger className="h-6 text-[10px] px-2 w-[130px] bg-background border-border">
                                <SelectValue placeholder="Next step..." />
                              </SelectTrigger>
                              <SelectContent>
                                {validNext.map((st) => (
                                  <SelectItem key={st} value={st} className="text-xs">
                                    {ORDER_STATUS_LABELS[st] ?? st}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Middle Row: Product Preview with Image */}
                    <div className="flex items-center gap-3.5 bg-muted/30 p-2.5 rounded-xl border border-border/40">
                      <div className="relative h-14 w-14 shrink-0 rounded-lg bg-muted overflow-hidden border border-border/60 flex items-center justify-center">
                        {firstItemImage ? (
                          <Image
                            src={firstItemImage}
                            alt={firstItemName}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {firstItemName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {totalItemsCount > 1
                            ? `+${totalItemsCount - 1} more item(s)`
                            : `Qty: ${firstItem?.quantity || 1}`}
                        </p>
                      </div>
                    </div>

                    {/* Customer Row */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-medium text-foreground truncate max-w-[150px]">
                          {customerName}
                        </span>
                      </div>
                      {customerPhone && (
                        <span className="tabular-nums">{customerPhone}</span>
                      )}
                    </div>

                    {/* Footer Row: Total Price and Manage Button */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Total Amount
                        </p>
                        <p className="text-base font-black tabular-nums text-foreground">
                          ৳{(order.total ?? 0).toLocaleString()}
                        </p>
                      </div>

                      <Link href={`/admin/orders/${order.id}`}>
                        <Button size="sm" className="gap-1.5 font-semibold">
                          <Eye className="h-4 w-4" />
                          Manage Order
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => applyFilters(searchTerm, statusFilter, page - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <span className="text-xs text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => applyFilters(searchTerm, statusFilter, page + 1)}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <OrderStatusConfirmDialog
        open={confirmDialogState.open}
        onOpenChange={(open) =>
          setConfirmDialogState((prev) => ({ ...prev, open }))
        }
        orderNumber={confirmDialogState.order?.orderNumber}
        targetStatus={confirmDialogState.targetStatus}
        onConfirm={handleConfirmStatusChange}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
}
