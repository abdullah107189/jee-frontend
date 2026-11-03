import "server-only";

import { cookies, headers } from "next/headers";
import { API_URL } from "@/lib/env";

export type CustomerOrder = {
  id: string;
  date: string;
  status: string;
  totalAmount: number;
  itemsCount: number;
  paymentMethod: string;
  items: Array<Record<string, unknown>>;
  orderNumber?: string;
  createdAt?: string;
  total?: number;
};

export type CustomerWarranty = {
  id: string;
  uniqueId: string;
  productName: string;
  status: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalDays?: number;
  seller: string;
  image: string;
};

export type CustomerStats = {
  totalOrders: number;
  activeWarranties: number;
  pendingClaims: number;
  totalSpent: number;
};

export type CustomerProfile = {
  fullName: string;
  name?: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  zipCode?: string;
  joinedDate: string;
  stats: CustomerStats;
};

export type CustomerOrderDetails = {
  id: string;
  date: string;
  status: string;
  timeline: Array<Record<string, unknown>>;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  dueAtDelivery: number;
  shippingAddress: Record<string, string>;
  items: Array<Record<string, unknown>>;
};

export type CustomerWarrantyDetails = {
  id: string;
  uniqueId: string;
  productName: string;
  status: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalDays?: number;
  progressPercent: number;
  seller: string;
  saleDate: string;
  orderId: string;
  image: string;
  claimHistory: Array<Record<string, string>>;
  durationMonths?: number;
  saleType?: string;
  terms?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  sellerName?: string;
};

/* ─────────── Auth Headers Helper ─────────── */

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const refreshedToken = headerStore.get("x-access-token");
  const accessToken =
    refreshedToken ?? cookieStore.get("accessToken")?.value;

  const reqHeaders: Record<string, string> = {
    Cookie: cookieStore.toString(),
    "Content-Type": "application/json",
  };

  if (accessToken) {
    reqHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  return reqHeaders;
}

function calculateDaysRemaining(endDateStr?: string | null): number {
  if (!endDateStr) return 0;
  const end = new Date(endDateStr).getTime();
  const now = Date.now();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function calculateTotalDays(startStr?: string | null, endStr?: string | null): number {
  if (!startStr || !endStr) return 365;
  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 365;
}

/* ─────────── Order Services ─────────── */

export async function getCustomerOrders(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<any> {
  const { getCustomerOrders: fetchOrders } = await import("./order.service");
  const res = await fetchOrders(params);
  return res.orders;
}

export async function getCustomerOrderDetails(orderId: string): Promise<any> {
  const { getCustomerOrderDetails: fetchDetail } = await import("./order.service");
  return fetchDetail(orderId);
}

/* ─────────── Warranty Services ─────────── */

export async function getCustomerWarranties(filters?: {
  status?: string;
  search?: string;
}): Promise<CustomerWarranty[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    queryParams.set("limit", "100");
    if (filters?.status && filters.status !== "ALL") {
      queryParams.set("status", filters.status.toUpperCase());
    }
    if (filters?.search) {
      queryParams.set("search", filters.search);
    }

    const res = await fetch(`${API_URL}/warranties?${queryParams.toString()}`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json().catch(() => null);
    const rawList = Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.data?.items)
      ? json.data.items
      : [];

    return rawList.map((w: any) => {
      const serial = w.productItem?.serialNumber || w.id;
      const prodName =
        w.productItem?.variant?.product?.name ||
        w.productName ||
        "JEE Authentic Hardware";
      const image =
        w.productItem?.variant?.images?.[0] ||
        w.image ||
        "";
      const seller =
        w.seller?.shopName ||
        w.seller?.user?.name ||
        "JEE Electronics";

      return {
        id: w.id,
        uniqueId: serial,
        productName: prodName,
        status: (w.effectiveStatus || w.status || "ACTIVE").toUpperCase(),
        startDate: w.startDate || "",
        endDate: w.endDate || "",
        daysRemaining: calculateDaysRemaining(w.endDate),
        totalDays: calculateTotalDays(w.startDate, w.endDate),
        seller,
        image,
      };
    });
  } catch (error) {
    console.error("[getCustomerWarranties]", error);
    return [];
  }
}

export async function getCustomerWarrantyDetails(id: string): Promise<CustomerWarrantyDetails | null> {
  try {
    const authHeaders = await getAuthHeaders();
    const [warrantyRes, claimsRes] = await Promise.all([
      fetch(`${API_URL}/warranties/${id}`, {
        method: "GET",
        headers: authHeaders,
        cache: "no-store",
      }),
      fetch(`${API_URL}/warranty-claims?warrantyId=${id}`, {
        method: "GET",
        headers: authHeaders,
        cache: "no-store",
      }).catch(() => null),
    ]);

    if (!warrantyRes.ok) {
      return null;
    }

    const wJson = await warrantyRes.json().catch(() => null);
    const w = wJson?.data || wJson;
    if (!w || !w.id) return null;

    let claimHistory: Array<Record<string, string>> = [];
    if (claimsRes && claimsRes.ok) {
      const cJson = await claimsRes.json().catch(() => null);
      const claimsList = Array.isArray(cJson?.data)
        ? cJson.data
        : Array.isArray(cJson?.data?.items)
        ? cJson.data.items
        : [];
      claimHistory = claimsList.map((c: any) => ({
        id: c.id,
        date: c.createdAt || "",
        type: c.claimType || "Repair",
        status: c.status || "PENDING",
        notes: c.description || c.resolution || "",
      }));
    }

    const daysRemaining = calculateDaysRemaining(w.endDate);
    const totalDays = calculateTotalDays(w.startDate, w.endDate);
    const progressPercent = totalDays > 0 ? Math.round((daysRemaining / totalDays) * 100) : 0;

    return {
      id: w.id,
      uniqueId: w.productItem?.serialNumber || w.id,
      productName:
        w.productItem?.variant?.product?.name ||
        w.productName ||
        "JEE Hardware",
      status: (w.effectiveStatus || w.status || "ACTIVE").toUpperCase(),
      startDate: w.startDate || "",
      endDate: w.endDate || "",
      daysRemaining,
      totalDays,
      progressPercent,
      seller: w.seller?.shopName || "JEE Electronics",
      saleDate: w.startDate || "",
      orderId: w.orderId ? `#${w.orderId}` : "Showroom Purchase",
      image: w.productItem?.variant?.images?.[0] || "",
      claimHistory,
      durationMonths: w.durationMonths || 24,
      saleType: w.seller ? "Showroom / Partner" : "Online Direct",
      terms: w.terms || "Standard JEE Manufacturer Warranty Coverage Policy.",
      customerName: w.customer?.user?.name || "",
      customerPhone: w.customer?.user?.phone || "",
      customerEmail: w.customer?.user?.email || "",
      sellerName: w.seller?.shopName || "JEE Official Retail",
    };
  } catch (error) {
    console.error("[getCustomerWarrantyDetails]", error);
    return null;
  }
}

/* ─────────── Customer Profile & Stats ─────────── */

export async function getCustomerProfile(): Promise<CustomerProfile> {
  const authHeaders = await getAuthHeaders();
  let customerData: any = null;

  try {
    const res = await fetch(`${API_URL}/customers/me`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json().catch(() => null);
      customerData = json?.data || json;
    }
  } catch (err) {
    console.error("[getCustomerProfile:customers/me]", err);
  }

  // Get user profile if customer info is lean
  let userData: any = null;
  try {
    const userRes = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });
    if (userRes.ok) {
      const uJson = await userRes.json().catch(() => null);
      userData = uJson?.data || uJson;
    }
  } catch (err) {
    console.error("[getCustomerProfile:users/me]", err);
  }

  const stats = await getCustomerStats();

  const user = customerData?.user || userData || {};
  return {
    fullName: user.name || "Valued Customer",
    name: user.name || "Valued Customer",
    email: user.email || "",
    phone: user.phone || "",
    address: customerData?.address || "",
    city: customerData?.city || "",
    zipCode: customerData?.zipCode || "",
    joinedDate: user.createdAt || new Date().toISOString(),
    stats,
  };
}

export async function getCustomerStats(): Promise<CustomerStats> {
  try {
    const authHeaders = await getAuthHeaders();
    const [ordersRes, warrantiesRes, claimsRes] = await Promise.all([
      fetch(`${API_URL}/orders?limit=100`, {
        method: "GET",
        headers: authHeaders,
        cache: "no-store",
      }).catch(() => null),
      fetch(`${API_URL}/warranties?limit=100`, {
        method: "GET",
        headers: authHeaders,
        cache: "no-store",
      }).catch(() => null),
      fetch(`${API_URL}/warranty-claims?limit=100`, {
        method: "GET",
        headers: authHeaders,
        cache: "no-store",
      }).catch(() => null),
    ]);

    let totalOrders = 0;
    let totalSpent = 0;
    if (ordersRes && ordersRes.ok) {
      const oJson = await ordersRes.json().catch(() => null);
      const orders = Array.isArray(oJson?.data)
        ? oJson.data
        : Array.isArray(oJson?.data?.orders)
        ? oJson.data.orders
        : [];
      totalOrders = oJson?.meta?.total ?? orders.length;
      totalSpent = orders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount || o.total) || 0), 0);
    }

    let activeWarranties = 0;
    if (warrantiesRes && warrantiesRes.ok) {
      const wJson = await warrantiesRes.json().catch(() => null);
      const warranties = Array.isArray(wJson?.data)
        ? wJson.data
        : Array.isArray(wJson?.data?.items)
        ? wJson.data.items
        : [];
      activeWarranties = warranties.filter(
        (w: any) => (w.effectiveStatus || w.status) === "ACTIVE"
      ).length;
    }

    let pendingClaims = 0;
    if (claimsRes && claimsRes.ok) {
      const cJson = await claimsRes.json().catch(() => null);
      const claims = Array.isArray(cJson?.data)
        ? cJson.data
        : Array.isArray(cJson?.data?.items)
        ? cJson.data.items
        : [];
      pendingClaims = claims.filter(
        (c: any) => (c.status || "PENDING") === "PENDING"
      ).length;
    }

    return {
      totalOrders,
      activeWarranties,
      pendingClaims,
      totalSpent,
    };
  } catch (error) {
    console.error("[getCustomerStats]", error);
    return {
      totalOrders: 0,
      activeWarranties: 0,
      pendingClaims: 0,
      totalSpent: 0,
    };
  }
}

/* ─────────── Customer Mutations ─────────── */

export async function createCustomerOrder(orderData: Record<string, unknown>) {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(orderData),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Failed to create order");
  }
  return json;
}

export async function updateCustomerProfile(data: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}) {
  const authHeaders = await getAuthHeaders();

  // Update user name and phone if provided
  if (data.name || data.phone) {
    await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        ...(data.name ? { name: data.name } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
      }),
    });
  }

  // Update customer address fields
  const custRes = await fetch(`${API_URL}/customers/me`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      address: data.address || "",
      city: data.city || "",
      zipCode: data.zipCode || "",
    }),
  });

  const json = await custRes.json().catch(() => null);
  if (!custRes.ok) {
    throw new Error(json?.message || "Failed to update profile details");
  }

  return { success: true, message: "Profile updated successfully!", profile: data };
}

export async function changeCustomerPassword(input: {
  currentPassword?: string;
  newPassword?: string;
}) {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      password: input.newPassword,
    }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Failed to change password");
  }

  return { success: true, message: "Password updated successfully!" };
}

export async function submitCustomerWarrantyClaim(input: {
  warrantyId: string;
  description: string;
}) {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/warranty-claims`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      warrantyId: input.warrantyId,
      description: input.description,
    }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Failed to submit warranty claim");
  }

  return {
    success: true,
    claimId: json?.data?.id || `CLM-${Date.now()}`,
    message: json?.message || "Warranty claim submitted successfully! Our service desk will contact you.",
  };
}
