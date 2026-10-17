"use server";

import { cookies } from "next/headers";
import { API_URL } from "@/lib/env";

/* ─────────── Action State ─────────── */

export interface OrderActionState {
  success: boolean;
  message: string;
  orderId?: string;
  orderNumber?: string;
  fieldErrors?: Record<string, string[]>;
}

/* ─────────── Create Order ─────────── */

export async function createOrderAction(
  _prevState: OrderActionState | null,
  formData: FormData,
): Promise<OrderActionState> {
  try {
    // Parse items from form (JSON string)
    const itemsRaw = formData.get("items");
    if (typeof itemsRaw !== "string") {
      return { success: false, message: "Cart items missing" };
    }

    const items = JSON.parse(itemsRaw) as Array<{
      variantId: string;
      quantity: number;
    }>;

    if (!Array.isArray(items) || items.length === 0) {
      return { success: false, message: "Cart is empty" };
    }

    // Parse shipping address
    const shippingRaw = formData.get("shippingAddress");
    if (typeof shippingRaw !== "string") {
      return { success: false, message: "Shipping address missing" };
    }
    const shippingAddress = JSON.parse(shippingRaw);

    // Parse payment way
    const paymentWay = (formData.get("paymentWay") as string) || "COD";
    if (!["COD", "FULL"].includes(paymentWay)) {
      return { success: false, message: "Invalid payment method" };
    }

    // Parse optional fields
    const shipping = Number(formData.get("shipping") ?? 0);
    const notes = formData.get("notes") as string | null;

    // Parse metadata (gateway data)
    const metadataRaw = formData.get("metadata");
    let metadata: Record<string, unknown> | undefined;
    if (typeof metadataRaw === "string" && metadataRaw.trim()) {
      metadata = JSON.parse(metadataRaw);
    }

    // Build payload
    const payload = {
      items,
      shippingAddress,
      paymentWay,
      shipping,
      notes: notes || undefined,
      metadata,
    };

    // Forward cookies to Express
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) {
      return { success: false, message: "Authentication required" };
    }

    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json();
    console.log("[SERVER ACTION] Express response:", {
      // ← ADD
      status: res.status,
      ok: res.ok,
      json,
    });

    if (!res.ok || !json.success) {
      return {
        success: false,
        message: json.message ?? "Failed to create order",
      };
    }

    return {
      success: true,
      message: "Order placed successfully",
      orderId: json.data.id,
      orderNumber: json.data.orderNumber,
    };
  } catch (error) {
    console.error("[CREATE_ORDER_ERROR]", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

/* ─────────── Cancel Order ─────────── */

export async function cancelOrderAction(
  orderId: string,
  reason?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    if (!orderId) {
      return { success: false, message: "Order ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) {
      return { success: false, message: "Authentication required" };
    }

    const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ reason: reason || "Cancelled by customer" }),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);
    if (!res.ok || (json && json.success === false)) {
      return {
        success: false,
        message: json?.message ?? "Failed to cancel order",
      };
    }

    return {
      success: true,
      message: json?.message ?? "Order cancelled successfully",
    };
  } catch (error) {
    console.error("[CANCEL_ORDER_ERROR]", error);
    return {
      success: false,
      message: "Network error while cancelling order.",
    };
  }
}

/* ─────────── Admin: Update Order Status ─────────── */

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
  reason?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    if (!orderId || !status) {
      return { success: false, message: "Order ID and status are required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) {
      return { success: false, message: "Authentication required" };
    }

    const payload: { status: string; reason?: string } = {
      status: status.toUpperCase(),
    };
    if (reason && reason.trim()) {
      payload.reason = reason.trim();
    }

    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);
    if (!res.ok || (json && json.success === false)) {
      return {
        success: false,
        message: json?.message ?? "Failed to update order status",
      };
    }

    return {
      success: true,
      message: json?.message ?? `Order status updated to ${status}`,
    };
  } catch (error) {
    console.error("[UPDATE_ORDER_STATUS_ERROR]", error);
    return {
      success: false,
      message: "Network error while updating order status.",
    };
  }
}


