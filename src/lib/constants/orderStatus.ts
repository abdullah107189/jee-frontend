import type { OrderStatus } from "@/lib/types/order.types";

/**
 * Shared state machine transitions for order progression.
 * PENDING -> [CONFIRMED, CANCELLED]
 * CONFIRMED -> [PROCESSING, CANCELLED]
 * PROCESSING -> [SHIPPED, CANCELLED]
 * SHIPPED -> [DELIVERED, RETURNED]
 * Others are terminal with empty transitions.
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "RETURNED"],
  DELIVERED: [],
  CANCELLED: [],
  RETURNED: [],
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "ডেলিভারি ব্যর্থ/ফেরত",
};

export const ORDER_STATUS_BADGE_VARIANTS: Record<
  OrderStatus,
  "default" | "success" | "warning" | "destructive" | "outline"
> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
  RETURNED: "destructive",
};

export function getValidNextStatuses(
  currentStatus: OrderStatus | string,
): OrderStatus[] {
  const upper = currentStatus?.toUpperCase() as OrderStatus;
  return ORDER_STATUS_TRANSITIONS[upper] ?? [];
}

export function getOrderStatusLabel(status: OrderStatus | string): string {
  const upper = status?.toUpperCase() as OrderStatus;
  return ORDER_STATUS_LABELS[upper] ?? status;
}

export function getOrderStatusBadgeVariant(
  status: OrderStatus | string,
): "default" | "success" | "warning" | "destructive" | "outline" {
  const upper = status?.toUpperCase() as OrderStatus;
  return ORDER_STATUS_BADGE_VARIANTS[upper] ?? "outline";
}
