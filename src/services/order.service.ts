import "server-only";

import { cookies, headers } from "next/headers";
import { API_URL } from "@/lib/env";
import type { Order, CustomerOrdersResponse } from "@/lib/types/order.types";



/* ─────────── Auth Headers Helper ─────────── */

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const refreshedToken = headerStore.get("x-access-token");
  const accessToken =
    refreshedToken ?? cookieStore.get("accessToken")?.value;

  const reqHeaders: Record<string, string> = {
    Cookie: cookieStore.toString(),
  };

  if (accessToken) {
    reqHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  return reqHeaders;
}

/* ─────────── Response Normalizer ─────────── */

function normalizeOrdersResponse(
  json: unknown,
  currentPage: number,
  limit: number,
): CustomerOrdersResponse {
  const payload = json as {
    data?: unknown;
    orders?: Order[];
    meta?: { total?: number; totalPages?: number };
    total?: number;
  } | null;

  let rawList: Order[] = [];

  if (Array.isArray(payload?.data)) {
    rawList = payload.data as Order[];
  } else if (payload?.data && typeof payload.data === "object") {
    const dataObj = payload.data as { items?: Order[]; orders?: Order[]; total?: number; totalPages?: number };
    if (Array.isArray(dataObj.items)) {
      rawList = dataObj.items;
    } else if (Array.isArray(dataObj.orders)) {
      rawList = dataObj.orders;
    }
  } else if (Array.isArray(payload?.orders)) {
    rawList = payload.orders;
  }

  const dataObj = (payload?.data && typeof payload.data === "object") ? payload.data as Record<string, unknown> : null;
  const total =
    payload?.meta?.total ??
    (typeof dataObj?.total === "number" ? dataObj.total : undefined) ??
    payload?.total ??
    rawList.length;

  const totalPages =
    payload?.meta?.totalPages ??
    (typeof dataObj?.totalPages === "number" ? dataObj.totalPages : undefined) ??
    Math.max(1, Math.ceil(total / limit));

  return {
    orders: rawList,
    total,
    page: currentPage,
    limit,
    totalPages,
  };
}

/* ─────────── Customer: List Orders ─────────── */

export async function getCustomerOrders(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CustomerOrdersResponse> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  try {
    const reqHeaders = await getAuthHeaders();
    const query = new URLSearchParams();

    if (params?.status && params.status !== "ALL" && params.status !== "all") {
      query.set("status", params.status.toUpperCase());
    }
    if (params?.search && params.search.trim()) {
      query.set("search", params.search.trim());
    }
    query.set("page", String(page));
    query.set("limit", String(limit));

    const qs = query.toString();
    const url = `${API_URL}/orders/my${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, {
      headers: reqHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      // Fallback endpoint if /orders is used
      if (res.status === 404) {
        const fallbackRes = await fetch(`${API_URL}/orders${qs ? `?${qs}` : ""}`, {
          headers: reqHeaders,
          cache: "no-store",
        });
        if (fallbackRes.ok) {
          const fbJson = await fallbackRes.json();
          return normalizeOrdersResponse(fbJson, page, limit);
        }
      }
      return { orders: [], total: 0, page, limit, totalPages: 1 };
    }

    const json = await res.json();
    return normalizeOrdersResponse(json, page, limit);
  } catch (error) {
    console.error("[GET_CUSTOMER_ORDERS_ERROR]", error);
    return { orders: [], total: 0, page, limit, totalPages: 1 };
  }
}

/* ─────────── Customer: Order Details ─────────── */

export async function getCustomerOrderDetails(
  orderId: string,
): Promise<Order | null> {
  if (!orderId) return null;

  try {
    const reqHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: reqHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderData = json?.data as any;
    if (orderData && !orderData.items && Array.isArray(orderData.orderItems)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderData.items = orderData.orderItems.map((it: any) => ({
        ...it,
        serialNumber: it.serialNumber || it.productItem?.serialNumber,
      }));
    }
    return (orderData as Order) ?? null;
  } catch (error) {
    console.error("[GET_CUSTOMER_ORDER_DETAILS_ERROR]", error);
    return null;
  }
}

/* ─────────── Admin: List All Orders ─────────── */

export async function getAdminOrders(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CustomerOrdersResponse> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  try {
    const reqHeaders = await getAuthHeaders();
    const query = new URLSearchParams();

    if (params?.status && params.status !== "ALL" && params.status !== "all") {
      query.set("status", params.status.toUpperCase());
    }
    if (params?.search && params.search.trim()) {
      query.set("search", params.search.trim());
    }
    query.set("page", String(page));
    query.set("limit", String(limit));

    const qs = query.toString();
    const url = `${API_URL}/orders${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, {
      headers: reqHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      return { orders: [], total: 0, page, limit, totalPages: 1 };
    }

    const json = await res.json();
    return normalizeOrdersResponse(json, page, limit);
  } catch (error) {
    console.error("[GET_ADMIN_ORDERS_ERROR]", error);
    return { orders: [], total: 0, page, limit, totalPages: 1 };
  }
}

/* ─────────── Admin: Order Details ─────────── */

export async function getAdminOrderDetails(
  orderId: string,
): Promise<Order | null> {
  if (!orderId) return null;

  try {
    const reqHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: reqHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderData = json?.data as any;
    if (orderData && !orderData.items && Array.isArray(orderData.orderItems)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderData.items = orderData.orderItems.map((it: any) => ({
        ...it,
        serialNumber: it.serialNumber || it.productItem?.serialNumber,
      }));
    }
    return (orderData as Order) ?? null;
  } catch (error) {
    console.error("[GET_ADMIN_ORDER_DETAILS_ERROR]", error);
    return null;
  }
}

export type AdminOrder = Order;