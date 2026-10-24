"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Truck,
  Package,
  QrCode,
  Barcode,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import type { OrderItem, OrderStatus } from "@/lib/types/order.types";
import { ORDER_STATUS_LABELS } from "@/lib/constants/orderStatus";
import { QrCameraScanner } from "./QrCameraScanner";

export interface StatusConfirmOptions {
  reason?: string;
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  consignmentId?: string;
  serialNumbers?: Record<string, string>;
}

interface OrderStatusConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber?: string;
  targetStatus: OrderStatus | null;
  items?: OrderItem[];
  onConfirm: (options?: StatusConfirmOptions | string) => Promise<void>;
  isLoading?: boolean;
}

const POPULAR_COURIERS = [
  { id: "Steadfast", name: "Steadfast Courier (অটোমেটিক API / Webhook)" },
  { id: "Pathao", name: "Pathao Courier (অটোমেটিক API / Webhook)" },
  { id: "Sundarban", name: "Sundarban Courier (ম্যানুয়াল স্লিপ / CN)" },
  { id: "RedX", name: "RedX Delivery" },
  { id: "Paperfly", name: "Paperfly" },
  { id: "Other", name: "Other / In-House Delivery" },
];

export function OrderStatusConfirmDialog({
  open,
  onOpenChange,
  orderNumber,
  targetStatus,
  items = [],
  onConfirm,
  isLoading = false,
}: OrderStatusConfirmDialogProps) {
  const [reason, setReason] = useState("");
  const [courierName, setCourierName] = useState("Steadfast");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [itemSerials, setItemSerials] = useState<Record<string, string>>({});

  // Camera QR Scanner states
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeScanItemId, setActiveScanItemId] = useState<string | null>(null);
  const [activeScanItemName, setActiveScanItemName] = useState<string>("");

  // Initialize serials from items when modal opens
  useEffect(() => {
    if (open && items.length > 0) {
      const initial: Record<string, string> = {};
      items.forEach((it) => {
        if (it.serialNumber) {
          initial[it.id] = it.serialNumber;
        }
      });
      setItemSerials(initial);
    }
  }, [open, items]);

  if (!targetStatus) return null;

  const handleOpenScanner = (itemId: string, itemName: string) => {
    setActiveScanItemId(itemId);
    setActiveScanItemName(itemName);
    setScannerOpen(true);
  };

  const handleCameraScanSuccess = (serial: string) => {
    if (activeScanItemId) {
      setItemSerials((prev) => ({
        ...prev,
        [activeScanItemId]: serial,
      }));
      toast.success(`Serial ${serial} scanned successfully!`);
    }
  };

  const missingSerialsCount =
    targetStatus === "PROCESSING"
      ? items.filter((it) => !itemSerials[it.id]?.trim()).length
      : 0;

  const isSubmitDisabled =
    isLoading ||
    (targetStatus === "PROCESSING" && (items.length === 0 || missingSerialsCount > 0)) ||
    (targetStatus === "SHIPPED" && (!trackingNumber.trim() || !courierName.trim()));

  const handleConfirm = async () => {
    const options: StatusConfirmOptions = {};

    if (reason.trim()) options.reason = reason.trim();

    // Strict Validation for PROCESSING: All items must have serials
    if (targetStatus === "PROCESSING") {
      if (!items || items.length === 0) {
        toast.error("অর্ডারের আইটেম লোড হয়নি অথবা অর্ডারে কোনো পণ্য নেই।");
        return;
      }
      const missing = items.filter((it) => !itemSerials[it.id]?.trim());
      if (missing.length > 0) {
        toast.error(
          `প্যাকিং নিশ্চিত করতে অর্ডারের সব (${items.length}টি) আইটেমের সিরিয়াল স্ক্যান/ইনপুট করুন।`,
        );
        return;
      }
      options.serialNumbers = itemSerials;
    }

    // Strict Validation for SHIPPED: Tracking number and courier are required
    if (targetStatus === "SHIPPED") {
      if (!trackingNumber.trim()) {
        toast.error("কুরিয়ার ট্র্যাকিং / কনসাইনমেন্ট নম্বর বাধ্যতামূলক।");
        return;
      }
      if (!courierName.trim()) {
        toast.error("অনুগ্রহ করে কুরিয়ার সার্ভিস নির্বাচন করুন।");
        return;
      }
      options.courierName = courierName;
      options.trackingNumber = trackingNumber.trim();
      if (trackingUrl.trim()) options.trackingUrl = trackingUrl.trim();
    }

    await onConfirm(options);
    resetForm();
  };

  const resetForm = () => {
    setReason("");
    setTrackingNumber("");
    setTrackingUrl("");
    setItemSerials({});
    onOpenChange(false);
  };

  const handleSerialChange = (itemId: string, value: string) => {
    setItemSerials((prev) => ({
      ...prev,
      [itemId]: value.toUpperCase(),
    }));
  };

  const getDialogDetails = () => {
    switch (targetStatus) {
      case "PROCESSING":
        return {
          title: "Order Packaging & Serial / QR Assignment",
          description: `You are moving order #${orderNumber ?? ""} to PROCESSING. Assign unit serial numbers / QR codes for warehouse packing.`,
          icon: <Package className="h-5 w-5 text-purple-600" />,
          confirmText: "Start Processing",
          confirmVariant: "default" as const,
        };
      case "SHIPPED":
        return {
          title: "Dispatch Order & Assign Courier",
          description: `Dispatch order #${orderNumber ?? ""} to courier. Enter tracking or consignment number for customer visibility.`,
          icon: <Truck className="h-5 w-5 text-blue-600" />,
          confirmText: "Confirm Dispatch",
          confirmVariant: "default" as const,
        };
      case "RETURNED":
        return {
          title: "Confirm Order Return (ডেলিভারি ব্যর্থ/ফেরত)",
          description: `Are you sure you want to mark order #${orderNumber ?? ""} as RETURNED? Items will be released back to available inventory.`,
          icon: <RotateCcw className="h-5 w-5 text-destructive" />,
          confirmText: "Confirm Return",
          confirmVariant: "destructive" as const,
        };
      case "CANCELLED":
        return {
          title: "Confirm Order Cancellation",
          description: `Are you sure you want to cancel order #${orderNumber ?? ""}? Reserved inventory units will be freed immediately.`,
          icon: <XCircle className="h-5 w-5 text-destructive" />,
          confirmText: "Confirm Cancellation",
          confirmVariant: "destructive" as const,
        };
      case "DELIVERED":
        return {
          title: "Confirm Order Delivery & Activate Warranty",
          description: `Mark order #${orderNumber ?? ""} as DELIVERED. Physical units become SOLD and manufacturer warranties are activated automatically.`,
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          confirmText: "Confirm Delivered",
          confirmVariant: "default" as const,
        };
      default:
        return {
          title: `Confirm Status Change: ${ORDER_STATUS_LABELS[targetStatus] ?? targetStatus}`,
          description: `Are you sure you want to update order #${orderNumber ?? ""} to ${ORDER_STATUS_LABELS[targetStatus] ?? targetStatus}?`,
          icon: <AlertCircle className="h-5 w-5 text-primary" />,
          confirmText: "Confirm Update",
          confirmVariant: "default" as const,
        };
    }
  };

  const details = getDialogDetails();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="p-0 mb-3">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              {details.icon}
              {details.title}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
            {details.description}
          </p>

          {/* PROCESSING: When items is empty */}
          {targetStatus === "PROCESSING" && items.length === 0 && (
            <div className="mb-5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-semibold text-destructive">
              ⚠️ অর্ডারের আইটেম পাওয়া যায়নি। আইটেম ছাড়া অর্ডার প্রসেস করা সম্ভব নয়।
            </div>
          )}

          {/* PROCESSING: Serial Numbers Assignment with Camera Button */}
          {targetStatus === "PROCESSING" && items.length > 0 && (
            <div className="space-y-3 mb-5 rounded-xl border border-border bg-muted/30 p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <Barcode className="h-4 w-4 text-primary" />
                  <span>Physical Serial / QR per Item:</span>
                </div>
                {missingSerialsCount > 0 ? (
                  <span className="text-[10px] text-destructive bg-destructive/10 px-2 py-0.5 rounded-full font-bold">
                    {missingSerialsCount}টি সিরিয়াল বাকি
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    সব সম্পন্ন ✓
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {items.map((it, idx) => {
                  const name = it.name || it.variant?.name || `Item #${idx + 1}`;
                  return (
                    <div key={it.id} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground truncate max-w-[260px]">
                          {name} {it.variant?.color ? `(${it.variant.color})` : ""}
                        </span>
                        <span>Qty: {it.quantity || 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            placeholder="Scan or type unit serial (e.g. JEE-FAN-001)"
                            value={itemSerials[it.id] || ""}
                            onChange={(e) => handleSerialChange(it.id, e.target.value)}
                            disabled={isLoading}
                            className="h-9 pl-9 font-mono text-xs uppercase bg-background"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenScanner(it.id, name)}
                          disabled={isLoading}
                          className="h-9 gap-1.5 text-xs px-3 shrink-0 bg-background hover:bg-primary/5 hover:text-primary rounded-xl font-medium border-border/80"
                          title="Scan with Camera"
                        >
                          <Camera className="h-3.5 w-3.5 text-primary" />
                          <span>Scan</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                * বারকোড স্ক্যানার গান দিয়ে সরাসরি স্ক্যান করতে পারেন অথবা <strong>Scan</strong> বাটনে ক্লিক করে ক্যামেরা দিয়ে QR কোড স্ক্যান করুন।
              </p>
            </div>
          )}

          {/* SHIPPED: Courier & Tracking */}
          {targetStatus === "SHIPPED" && (
            <div className="space-y-3.5 mb-5 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Courier Service <span className="text-destructive">*</span>:
                </label>
                <Select
                  value={courierName}
                  onValueChange={(val) => setCourierName(val || "Steadfast")}
                >
                  <SelectTrigger className="bg-background h-10">
                    <SelectValue placeholder="Select courier" />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_COURIERS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Consignment / Tracking Number <span className="text-destructive">*</span>:
                </label>
                <Input
                  placeholder="e.g. ST-8932472 or CN-9012"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  disabled={isLoading}
                  className="bg-background text-sm font-mono"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  কুরিয়ার পোর্টালে পার্সেল বুক করার পর প্রাপ্ত ট্র্যাকিং নম্বরটি এখানে দিন।
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Direct Tracking Link (ঐচ্ছিক):
                </label>
                <Input
                  placeholder="https://steadfast.com.bd/t/..."
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  disabled={isLoading}
                  className="bg-background text-xs"
                />
              </div>
            </div>
          )}

          {/* RETURNED: Return reason */}
          {targetStatus === "RETURNED" && (
            <div className="space-y-1.5 mb-5">
              <label className="text-xs font-semibold text-foreground">
                ফেরতের কারণ (ঐচ্ছিক):
              </label>
              <Input
                placeholder="e.g. কাস্টমার পার্সেল রিসিভ করতে অপারগতা প্রকাশ করেছেন..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isLoading}
                className="bg-background text-sm"
              />
            </div>
          )}

          <DialogFooter className="p-0 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={details.confirmVariant}
              onClick={handleConfirm}
              disabled={isSubmitDisabled}
            >
              {isLoading ? "Updating..." : details.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Camera Scanner Modal */}
      <QrCameraScanner
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScanSuccess={handleCameraScanSuccess}
        title={`Scan QR: ${activeScanItemName}`}
      />
    </>
  );
}
