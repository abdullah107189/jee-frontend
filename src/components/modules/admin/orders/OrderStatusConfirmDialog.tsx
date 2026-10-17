"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertCircle, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { OrderStatus } from "@/lib/types/order.types";
import { ORDER_STATUS_LABELS } from "@/lib/constants/orderStatus";

interface OrderStatusConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber?: string;
  targetStatus: OrderStatus | null;
  onConfirm: (reason?: string) => Promise<void>;
  isLoading?: boolean;
}

export function OrderStatusConfirmDialog({
  open,
  onOpenChange,
  orderNumber,
  targetStatus,
  onConfirm,
  isLoading = false,
}: OrderStatusConfirmDialogProps) {
  const [reason, setReason] = useState("");

  if (!targetStatus) return null;

  const handleConfirm = async () => {
    await onConfirm(reason.trim() || undefined);
    setReason("");
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  const getDialogDetails = () => {
    switch (targetStatus) {
      case "RETURNED":
        return {
          title: "Confirm Order Return (ডেলিভারি ব্যর্থ/ফেরত)",
          description: `Are you sure you want to mark order #${orderNumber ?? ""} as RETURNED? Items will be released back to available inventory.`,
          icon: <RotateCcw className="h-5 w-5 text-destructive" />,
          confirmText: "Confirm Return",
          confirmVariant: "destructive" as const,
          showReasonInput: true,
        };
      case "CANCELLED":
        return {
          title: "Confirm Order Cancellation",
          description: `Are you sure you want to cancel order #${orderNumber ?? ""}? Reserved stock will be released.`,
          icon: <XCircle className="h-5 w-5 text-destructive" />,
          confirmText: "Confirm Cancellation",
          confirmVariant: "destructive" as const,
          showReasonInput: false,
        };
      case "DELIVERED":
        return {
          title: "Confirm Order Delivery",
          description: `Are you sure you want to mark order #${orderNumber ?? ""} as DELIVERED? Warranties will be automatically activated.`,
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          confirmText: "Confirm Delivered",
          confirmVariant: "default" as const,
          showReasonInput: false,
        };
      default:
        return {
          title: `Confirm Status Change: ${ORDER_STATUS_LABELS[targetStatus] ?? targetStatus}`,
          description: `Are you sure you want to update order #${orderNumber ?? ""} to ${ORDER_STATUS_LABELS[targetStatus] ?? targetStatus}?`,
          icon: <AlertCircle className="h-5 w-5 text-primary" />,
          confirmText: "Confirm",
          confirmVariant: "default" as const,
          showReasonInput: false,
        };
    }
  };

  const details = getDialogDetails();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="p-0 mb-3">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            {details.icon}
            {details.title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-4">
          {details.description}
        </p>

        {details.showReasonInput && (
          <div className="space-y-1.5 mb-5">
            <label className="text-xs font-semibold text-foreground">
              ফেরতের কারণ (ঐচ্ছিক):
            </label>
            <Input
              placeholder="e.g. গ্রাহক পণ্য গ্রহণ করতে অপারগতা প্রকাশ করেছেন..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
              className="bg-background text-sm"
            />
          </div>
        )}

        <DialogFooter className="p-0 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={details.confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : details.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
