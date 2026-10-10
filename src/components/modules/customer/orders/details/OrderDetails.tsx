"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  CreditCard,
  Printer,
  ShieldCheck,
  Phone,
  FileText,
  XCircle,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { cancelOrderAction } from "@/actions/order.actions";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types/order.types";

interface OrderDetailsProps {
  order: Order | null;
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

const MILESTONES: Array<{ status: OrderStatus; label: string; icon: any }> = [
  { status: "PENDING", label: "Placed", icon: Clock },
  { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { status: "PROCESSING", label: "Processing", icon: Package },
  { status: "SHIPPED", label: "Shipped", icon: Truck },
  { status: "DELIVERED", label: "Delivered", icon: ShieldCheck },
];

export function OrderDetails({ order }: OrderDetailsProps) {
  const router = useRouter();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  if (!order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-8 rounded-2xl bg-card border border-border">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-1">Order Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          We couldn&apos;t find this order. It may have been removed or you may have entered an incorrect link.
        </p>
        <Link href="/customer/orders">
          <Button variant="default" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED" || order.status === "RETURNED";
  const canCancel =
    order.status === "PENDING" || order.status === "CONFIRMED";

  const getMilestoneIndex = (status: OrderStatus | string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = getMilestoneIndex(order.status);

  const handleCancelSubmit = async () => {
    if (!order.id) return;
    setIsCancelling(true);
    try {
      const res = await cancelOrderAction(order.id, cancelReason);
      if (res.success) {
        toast.success(res.message);
        setCancelModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const formattedPlacedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/customer/orders"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to My Orders
        </Link>

        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="gap-1.5 print:hidden"
        >
          <Printer className="h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      {/* Header Banner Card with Order Tracking Stepper */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                #{order.orderNumber}
              </h1>
              <Badge variant={statusBadgeVariant(order.status)} className="text-xs px-3 py-1">
                {order.status}
              </Badge>
              {order.paymentStatus && (
                <Badge variant={paymentBadgeVariant(order.paymentStatus)} className="text-xs px-3 py-1">
                  Payment: {order.paymentStatus}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Placed on {formattedPlacedDate}
            </p>
          </div>

          {canCancel && (
            <Button
              onClick={() => setCancelModalOpen(true)}
              variant="destructive"
              size="sm"
              className="self-start sm:self-auto gap-1.5 print:hidden"
            >
              <XCircle className="h-4 w-4" />
              Cancel Order
            </Button>
          )}
        </div>

        {/* Stepper Inside Card */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Delivery Status
          </p>

          {isCancelled ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              <XCircle className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-semibold text-sm">
                  Order was {order.status.toLowerCase()}
                </p>
                <p className="text-xs text-destructive/80 mt-0.5">
                  {order.cancelledAt
                    ? `Cancelled on ${new Date(order.cancelledAt).toLocaleDateString("en-GB")}`
                    : "This order is no longer in progress."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {MILESTONES.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.status}
                    className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-xl transition-all border ${
                      isCurrent
                        ? "border-primary/40 bg-primary/5 ring-2 ring-primary/20"
                        : isCompleted
                        ? "border-border/60 bg-muted/20"
                        : "border-transparent bg-muted/10 opacity-60"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full mb-2 transition-colors ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-primary font-semibold mt-0.5">
                        Current Status
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Responsive 12-col Desktop, 2-col Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Purchased Items (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
              <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Purchased Items ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 divide-y divide-border/60">
              {order.items?.map((item) => {
                const itemName =
                  item.name ||
                  item.product?.name ||
                  item.variant?.product?.name ||
                  "Product Item";

                const itemImg =
                  item.image ||
                  item.variant?.image ||
                  item.variant?.product?.images?.[0] ||
                  item.product?.images?.[0];

                const itemPrice = item.price || item.unitPrice || 0;
                const lineTotal = item.total || itemPrice * (item.quantity || 1);
                const warrantyMonths =
                  item.warrantyMonths ||
                  item.variant?.product?.warrantyMonths ||
                  item.product?.warrantyMonths;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Product Thumbnail with Image */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border/60 flex items-center justify-center">
                        {itemImg ? (
                          <Image
                            src={itemImg}
                            alt={itemName}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 space-y-1.5 flex-1">
                        <p className="font-bold text-base text-foreground leading-snug">
                          {itemName}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Qty: {item.quantity || 1}
                          </span>
                          <span>•</span>
                          <span>Unit: ৳{itemPrice.toLocaleString()}</span>
                          {item.variant?.color && (
                            <>
                              <span>•</span>
                              <span>Color: {item.variant.color}</span>
                            </>
                          )}
                          {item.variant?.size && (
                            <>
                              <span>•</span>
                              <span>Size: {item.variant.size}</span>
                            </>
                          )}
                        </div>

                        {/* Serial Number & Warranty Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {item.serialNumber && (
                            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-muted text-foreground border border-border/60">
                              SN: {item.serialNumber}
                            </span>
                          )}

                          {warrantyMonths && warrantyMonths > 0 && (
                            <Badge variant="outline" className="text-[10px] gap-1 px-2 py-0.5">
                              <ShieldCheck className="h-3 w-3 text-primary" />
                              {warrantyMonths} Months Warranty
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/40">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-black text-lg tabular-nums text-foreground mt-0.5">
                        ৳{lineTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Customer Order Notes */}
          {order.notes && (
            <Card className="border border-border bg-card shadow-sm">
              <CardContent className="p-5 flex items-start gap-3.5">
                <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Order Notes
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {order.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Financials, Delivery & Payment (4 cols on lg) */}
        <div className="space-y-6 lg:col-span-4">
          {/* 1. Order Summary Card */}
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums font-medium text-foreground">
                  ৳{(order.subtotal ?? 0).toLocaleString()}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span className="tabular-nums font-medium">
                    -৳{order.discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="tabular-nums font-medium text-foreground">
                  ৳{(order.shipping ?? 0).toLocaleString()}
                </span>
              </div>

              {order.tax !== undefined && order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="tabular-nums font-medium text-foreground">
                    ৳{order.tax.toLocaleString()}
                  </span>
                </div>
              )}

              <Separator className="my-2" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-base text-foreground">Total Payable</span>
                <span className="text-2xl font-black tabular-nums text-primary">
                  ৳{(order.total ?? 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 2. Delivery Address */}
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs sm:text-sm">
              <p className="font-bold text-foreground text-base">
                {order.shippingAddress?.fullName}
              </p>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <a href={`tel:${order.shippingAddress?.phone}`} className="hover:underline text-foreground tabular-nums">
                  {order.shippingAddress?.phone}
                </a>
              </p>
              <p className="text-muted-foreground leading-relaxed pt-1">
                {order.shippingAddress?.streetAddress ||
                  order.shippingAddress?.addressLine1 ||
                  order.shippingAddress?.address}
                {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                {order.shippingAddress?.upazilaName && `, ${order.shippingAddress.upazilaName}`}
                {order.shippingAddress?.districtName && `, ${order.shippingAddress.districtName}`}
                {order.shippingAddress?.divisionName && `, ${order.shippingAddress.divisionName}`}
                {order.shippingAddress?.zipCode && ` - ${order.shippingAddress.zipCode}`}
              </p>
            </CardContent>
          </Card>

          {/* 3. Payment Method */}
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span className="font-bold text-foreground">
                  {order.paymentWay === "FULL" ? "Online Payment (bKash/Nagad)" : "Cash On Delivery"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={paymentBadgeVariant(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.payments?.[0]?.transactionId && (
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {order.payments[0].transactionId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Help Card */}
          <Card className="border border-border bg-muted/20 shadow-sm print:hidden">
            <CardContent className="p-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground">Questions regarding your order?</span>
              </div>
              <a
                href="tel:+8801700000000"
                className="font-bold text-primary hover:underline"
              >
                Call Hotline
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="p-0 mb-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Cancel Order #{order.orderNumber}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to cancel this order? Once cancelled, reserved stock will be returned to store inventory.
          </p>

          <div className="space-y-2 mb-6">
            <label
              htmlFor="cancel-reason"
              className="text-xs font-medium text-foreground"
            >
              Reason for cancellation (optional):
            </label>
            <input
              id="cancel-reason"
              type="text"
              placeholder="e.g. Changed my mind, found another product"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <DialogFooter className="p-0 gap-2">
            <Button
              onClick={() => setCancelModalOpen(false)}
              variant="outline"
              disabled={isCancelling}
            >
              Keep Order
            </Button>
            <Button
              onClick={handleCancelSubmit}
              variant="destructive"
              disabled={isCancelling}
              className="gap-1.5"
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}