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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Mail,
  User,
  FileText,
  RotateCcw,
  ArrowRightCircle,
  XCircle,
  Hash,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { updateOrderStatusAction } from "@/actions/order.actions";
import { OrderStatusConfirmDialog } from "@/components/modules/admin/orders/OrderStatusConfirmDialog";
import {
  getValidNextStatuses,
  getOrderStatusBadgeVariant,
  ORDER_STATUS_LABELS,
} from "@/lib/constants/orderStatus";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types/order.types";

interface AdminOrderDetailsProps {
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

export function AdminOrderDetails({ order }: AdminOrderDetailsProps) {
  const router = useRouter();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-8 rounded-2xl bg-card border border-border">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-1">Order Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          The requested order does not exist or has been removed.
        </p>
        <Link href="/admin/orders">
          <Button variant="default" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED" || order.status === "RETURNED";
  const validNextStatuses = getValidNextStatuses(order.status);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingTargetStatus, setPendingTargetStatus] = useState<OrderStatus | null>(null);

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

  const handleOpenStatusModal = (targetStatus?: string) => {
    setSelectedStatus(targetStatus || validNextStatuses[0] || "");
    setStatusModalOpen(true);
  };

  const handleSelectStatus = async (target: OrderStatus) => {
    setPendingTargetStatus(target);
    setConfirmDialogOpen(true);
  };

  const handleConfirmStatusChange = async (optionsOrReason?: any) => {
    if (!pendingTargetStatus || !order.id) return;
    setIsUpdating(true);
    try {
      const res = await updateOrderStatusAction(
        order.id,
        pendingTargetStatus,
        optionsOrReason,
      );
      if (res.success) {
        toast.success(res.message);
        setConfirmDialogOpen(false);
        setStatusModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to update order status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusSubmit = async () => {
    if (!order.id || !selectedStatus) return;
    await handleSelectStatus(selectedStatus as OrderStatus);
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

  const customerName =
    order.customer?.name ||
    order.customerName ||
    order.shippingAddress?.fullName ||
    "Customer";
  const customerPhone =
    order.customer?.phone ||
    order.customerPhone ||
    order.shippingAddress?.phone ||
    "N/A";
  const customerEmail =
    order.customer?.email ||
    order.customerEmail ||
    order.shippingAddress?.email ||
    "N/A";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Orders List
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

      {/* 2. Executive Header Card with Status Actions */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                #{order.orderNumber}
              </h1>
              <Badge variant={statusBadgeVariant(order.status)} className="text-xs px-3 py-1">
                {order.status === "RETURNED" ? "ডেলিভারি ব্যর্থ/ফেরত" : order.status}
              </Badge>
              {order.paymentStatus && (
                <Badge variant={paymentBadgeVariant(order.paymentStatus)} className="text-xs px-3 py-1">
                  Payment: {order.paymentStatus}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Placed on {formattedPlacedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <User className="h-3.5 w-3.5 text-primary" />
                {customerName}
              </span>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            {validNextStatuses.length > 0 && (
              <Select
                value=""
                onValueChange={(val) => {
                  if (val) handleSelectStatus(val as OrderStatus);
                }}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-[180px] bg-background border-border h-10 font-medium">
                  <SelectValue placeholder="Update status..." />
                </SelectTrigger>
                <SelectContent>
                  {validNextStatuses.map((st) => (
                    <SelectItem key={st} value={st}>
                      {ORDER_STATUS_LABELS[st] ?? st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* 3. Visual Stepper inside Header */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Order Fulfillment Progress
          </p>

          {isCancelled ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              <XCircle className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-semibold text-sm">
                  Order status is {order.status === "RETURNED" ? "ডেলিভারি ব্যর্থ/ফেরত (RETURNED)" : order.status}
                </p>
                <p className="text-xs text-destructive/80 mt-0.5">
                  {order.status === "RETURNED"
                    ? "ডেলিভারি ব্যর্থ হয়েছে অথবা অর্ডারটি ফেরত এসেছে। পণ্যসমূহ স্টকে ফেরত দেওয়া হয়েছে।"
                    : "This order was marked as cancelled. Stock and warranty adjustments follow MVP guidelines."}
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
                        Current Step
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Main Responsive Grid: 12 Columns on Desktop, 2 Columns on Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Ordered Items (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Ordered Items ({order.items?.length || 0})
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Includes physical unit & serial data
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 divide-y divide-border/60">
              {order.items?.map((item) => {
                const itemName =
                  item.name ||
                  item.product?.name ||
                  item.variant?.product?.name ||
                  "Product Unit";

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
                      {/* Product Thumbnail with Next Image */}
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

                      {/* Product Metadata */}
                      <div className="min-w-0 space-y-1.5 flex-1">
                        <p className="font-bold text-base text-foreground leading-snug">
                          {itemName}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Qty: {item.quantity || 1}
                          </span>
                          <span>•</span>
                          <span>Unit Price: ৳{itemPrice.toLocaleString()}</span>
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

                        {/* Badges: Serial Number & Warranty */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {item.serialNumber ? (
                            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-muted text-foreground border border-border/60">
                              SN: {item.serialNumber}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">
                              Physical serial: Assigned upon fulfillment
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

                    {/* Price column */}
                    <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/40">
                      <p className="text-xs text-muted-foreground">Item Subtotal</p>
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
                    Customer Order Notes
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {order.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Customer Info, Shipping & Financials (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Financial Total Calculation */}
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items Subtotal</span>
                <span className="tabular-nums font-medium text-foreground">
                  ৳{(order.subtotal ?? 0).toLocaleString()}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Special Discount</span>
                  <span className="tabular-nums font-medium">
                    -৳{order.discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery / Shipping Fee</span>
                <span className="tabular-nums font-medium text-foreground">
                  ৳{(order.shipping ?? 0).toLocaleString()}
                </span>
              </div>

              {order.tax !== undefined && order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax / VAT</span>
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

          {/* 2. Customer Information */}
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Customer Account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5 text-sm">
              <p className="font-bold text-foreground text-base">{customerName}</p>
              <div className="space-y-1.5 pt-1 text-xs sm:text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                  <a href={`tel:${customerPhone}`} className="hover:underline text-foreground tabular-nums">
                    {customerPhone}
                  </a>
                </p>
                {customerEmail && customerEmail !== "N/A" && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <a href={`mailto:${customerEmail}`} className="hover:underline text-foreground">
                      {customerEmail}
                    </a>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 3. Delivery Address */}
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Shipping Destination
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs sm:text-sm">
              <p className="font-semibold text-foreground">
                {order.shippingAddress?.fullName || customerName}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {order.shippingAddress?.streetAddress ||
                  order.shippingAddress?.addressLine1 ||
                  order.shippingAddress?.address ||
                  "No street address provided"}
                {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                {order.shippingAddress?.upazilaName && `, ${order.shippingAddress.upazilaName}`}
                {order.shippingAddress?.districtName && `, ${order.shippingAddress.districtName}`}
                {order.shippingAddress?.divisionName && `, ${order.shippingAddress.divisionName}`}
                {order.shippingAddress?.zipCode && ` - ${order.shippingAddress.zipCode}`}
              </p>
            </CardContent>
          </Card>

          {/* Courier & Dispatch Information */}
          {(order.courierName || order.trackingNumber) && (
            <Card className="border border-border bg-card shadow-sm overflow-hidden">
              <CardHeader className="bg-blue-50/50 border-b border-border/60 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-blue-900">
                  <Truck className="h-4 w-4 text-primary" />
                  Courier & Dispatch
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Courier Service:</span>
                  <span className="font-bold text-foreground">
                    {order.courierName || "Standard Courier"}
                  </span>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tracking / CN #:</span>
                    <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                      {order.trackingNumber}
                    </span>
                  </div>
                )}
                {order.trackingUrl && (
                  <div className="pt-2">
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live Courier Tracking
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 4. Payment Information */}
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment Record
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-bold text-foreground">
                  Cash On Delivery
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <Badge variant={paymentBadgeVariant(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                পণ্য হাতে পেয়ে টাকা দিন
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Update Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="p-0 mb-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Update Status: #{order.orderNumber}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
            Select a target state for this order. Moving status forward advances physical item inventory.
          </p>

          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-foreground">Select Status:</label>
            <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val ?? "")}>
              <SelectTrigger className="w-full bg-background border-border h-10">
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent>
                {validNextStatuses.map((st) => (
                  <SelectItem key={st} value={st}>
                    {ORDER_STATUS_LABELS[st] ?? st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedStatus === "DELIVERED" && (
              <p className="text-xs text-primary font-medium mt-2 bg-primary/10 p-2.5 rounded-lg border border-primary/20">
                ⚡ Note: Moving to DELIVERED automatically activates warranties for sold units per MVP flow.
              </p>
            )}
            {selectedStatus === "RETURNED" && (
              <p className="text-xs text-destructive font-medium mt-2 bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">
                ⚡ Note: Moving to RETURNED (ডেলিভারি ব্যর্থ/ফেরত) releases reserved items back to available inventory.
              </p>
            )}
          </div>

          <DialogFooter className="p-0 gap-2">
            <Button
              onClick={() => setStatusModalOpen(false)}
              variant="outline"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusSubmit}
              disabled={isUpdating || !selectedStatus}
              className="gap-1.5"
            >
              {isUpdating ? "Saving..." : "Confirm Status Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OrderStatusConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        orderNumber={order.orderNumber}
        targetStatus={pendingTargetStatus}
        items={order.items}
        onConfirm={handleConfirmStatusChange}
        isLoading={isUpdating}
      />
    </div>
  );
}
