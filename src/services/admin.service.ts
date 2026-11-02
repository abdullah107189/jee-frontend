import "server-only";

import { cookies, headers } from "next/headers";
import { formatAppDateTime } from "@/lib/utils";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const refreshedToken = headerStore.get("x-access-token");
  const token = refreshedToken || cookieStore.get("accessToken")?.value;

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Cookie: token
      ? `accessToken=${token}; ${cookieStore.toString()}`
      : cookieStore.toString(),
  };

  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  return reqHeaders;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  isActive: boolean;
  isVerified: boolean;
  joinedDate: string;
  avatar: string;
}

export interface AdminSeller {
  id: string;
  userId?: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: string;
  joinedDate: string;
  salesCount: number;
  warrantyCount: number;
  licenseNo: string;
  licenseDocUrl?: string;
  nidNumber?: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  taxId?: string | null;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  action: string;
  entity: string;
  rawEntity?: string;
  entityId?: string;
  details: string;
  rawChanges?: unknown;
  ipAddress: string;
  severity: string;
}
export type AdminAnalytics = Record<string, any>;

export type AdminOrder = Record<string, any>;
export type AdminWarranty = Record<string, any>;
 
export interface AdminProductItem {
  id: string;
  productName: string;
  productId?: string;
  variantId?: string;
  sku?: string;
  uniqueId: string;
  serialNumber?: string;
  status: string;
  createdAt: string;
}
export type AdminCategory = Record<string, any>; 
export type AdminWarrantyClaim = Record<string, any>;

export async function getUsers(): Promise<AdminUser[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users?limit=100`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch users from backend:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    const rawUsers: any[] = Array.isArray(json.data) ? json.data : [];

    return rawUsers.map((u) => ({
      id: u.id,
      name: u.name || "N/A",
      email: u.email,
      phone: u.phone || "N/A",
      role: (u.role || "customer").toLowerCase(),
      status: u.isActive ? "Active" : "Disabled",
      isActive: Boolean(u.isActive),
      isVerified: Boolean(u.isVerified),
      joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "N/A",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || u.email)}`,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getSellers(): Promise<AdminSeller[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/sellers?limit=100`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch sellers from backend:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    const rawSellers: any[] = Array.isArray(json.data) ? json.data : [];

    return rawSellers.map((s) => ({
      id: s.id,
      userId: s.userId,
      companyName: s.companyName || "N/A",
      ownerName: s.user?.name || "N/A",
      email: s.user?.email || "N/A",
      phone: s.user?.phone || s.phone || "N/A",
      status: s.status, // "APPROVED", "PENDING", "SUSPENDED", "DISABLED"
      joinedDate: s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : "N/A",
      salesCount: s._count?.offlineSales ?? 0,
      warrantyCount: 0,
      licenseNo: s.businessLicense || "N/A",
      licenseDocUrl: s.businessLicense ? `https://placehold.co/600x400/png?text=${encodeURIComponent(s.companyName + ' License')}` : "",
      nidNumber: s.taxId || "N/A",
      address: s.address,
      city: s.city,
      state: s.state,
      zipCode: s.zipCode,
      country: s.country,
      taxId: s.taxId,
    }));
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return [];
  }
}

export async function getPendingSellers(): Promise<AdminSeller[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/sellers?status=PENDING&limit=100`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch pending sellers from backend:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    const rawSellers: any[] = Array.isArray(json.data) ? json.data : [];

    return rawSellers.map((s) => ({
      id: s.id,
      userId: s.userId,
      companyName: s.companyName || "N/A",
      ownerName: s.user?.name || "N/A",
      email: s.user?.email || "N/A",
      phone: s.user?.phone || s.phone || "N/A",
      status: s.status,
      joinedDate: s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : "N/A",
      salesCount: 0,
      warrantyCount: 0,
      licenseNo: s.businessLicense || "N/A",
      licenseDocUrl: s.businessLicense ? `https://placehold.co/600x400/png?text=${encodeURIComponent(s.companyName + ' License')}` : "",
      nidNumber: s.taxId || "N/A",
      address: s.address,
      city: s.city,
      state: s.state,
      zipCode: s.zipCode,
      country: s.country,
      taxId: s.taxId,
    }));
  } catch (error) {
    console.error("Error fetching pending sellers:", error);
    return [];
  }
}

export async function getAuditLogs(query?: {
  search?: string;
  action?: string;
  severity?: string;
  page?: number;
  limit?: number;
}): Promise<AuditLog[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const params = new URLSearchParams();
    params.set("limit", String(query?.limit || 100));
    if (query?.page) params.set("page", String(query.page));
    if (query?.search && query.search.trim()) params.set("search", query.search.trim());
    if (query?.action && query.action !== "ALL") params.set("action", query.action);
    if (query?.severity) params.set("severity", query.severity);

    const res = await fetch(`${API_URL}/audit-logs?${params.toString()}`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch audit logs:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    const rawLogs: any[] = Array.isArray(json.data) ? json.data : [];

    return rawLogs.map((log) => {
      const timestamp = log.createdAt
        ? formatAppDateTime(log.createdAt)
        : "N/A";
      const userName = log.user?.name || "System Admin";
      const userEmail = log.user?.email || "admin@jee.com";
      const targetEntity =
        log.entity && log.entityId
          ? `${log.entity} (${log.entityId.slice(0, 8)})`
          : log.entity || "System";

      let details = "";
      if (log.changes) {
        try {
          details =
            typeof log.changes === "string"
              ? log.changes
              : JSON.stringify(log.changes);
        } catch {
          details = "Data modified";
        }
      } else {
        details = `Action performed on ${log.entity || "resource"}`;
      }

      return {
        id: log.id,
        timestamp,
        user: userName,
        userEmail,
        action: log.action || "ACTIVITY",
        entity: targetEntity,
        rawEntity: log.entity || "System",
        entityId: log.entityId || "",
        details,
        rawChanges: log.changes ?? null,
        ipAddress: log.ipAddress || "127.0.0.1",
        severity: log.severity || "INFO",
      };
    });
  } catch (error) {
    console.error("[getAuditLogs] error:", error);
    return [];
  }
}

export async function getAnalytics(_period = 'MONTH'): Promise<AdminAnalytics> {
  return {
    salesTrend: [
      { month: 'Jan', online: 4200, offline: 3100 }, { month: 'Feb', online: 5100, offline: 3800 }, { month: 'Mar', online: 6800, offline: 4900 }, { month: 'Apr', online: 7200, offline: 5400 },
      { month: 'May', online: 8900, offline: 6200 }, { month: 'Jun', online: 9500, offline: 7100 }, { month: 'Jul', online: 11200, offline: 8400 }, { month: 'Aug', online: 12800, offline: 9600 },
    ],
    categorySales: [
      { category: 'Ceiling Fans', sales: 480 }, { category: 'Air Conditioners', sales: 320 }, { category: 'LED Bulbs', sales: 1250 }, { category: 'Home Appliances', sales: 640 }, { category: 'Smart TV & Audio', sales: 290 },
    ],
    topSellers: [
      { name: 'Vision Official Store', sales: 342, revenue: 1197000 }, { name: 'Electro Tech Dhaka', sales: 189, revenue: 661500 }, { name: 'Sylhet Digital Appliances', sales: 95, revenue: 332500 }, { name: 'Bogra Smart Gadgets', sales: 42, revenue: 147000 },
    ],
    bestSellingProducts: [
      { id: 'P1', name: 'Vision 56" Ceiling Fan', category: 'Ceiling Fans', sold: 480, revenue: 1680000 }, { id: 'P2', name: 'LED Bulb 15W Pack', category: 'LED Bulbs', sold: 1250, revenue: 312500 }, { id: 'P3', name: 'Vision AC 1.5 Ton Inverter', category: 'Air Conditioners', sold: 320, revenue: 14400000 }, { id: 'P4', name: 'Dry Iron 1000W Heavy', category: 'Home Appliances', sold: 290, revenue: 435000 },
    ],
    lowStockProducts: [
      { id: 'P10', name: 'Smart Inverter Microwave 25L', category: 'Appliances', stock: 2, status: 'CRITICAL' }, { id: 'P12', name: 'Rechargeable Portable Fan', category: 'Fans', stock: 4, status: 'LOW' }, { id: 'P15', name: 'High Speed Table Fan 16"', category: 'Fans', stock: 3, status: 'LOW' },
    ],
    expiringWarranties: [
      { id: 'WAR-104', uniqueId: 'IRON-20211', product: 'Dry Iron 1000W', customer: 'Farid Hossain', expiryDate: '2026-08-15', daysRemaining: 5 }, { id: 'WAR-108', uniqueId: 'FAN-002100', product: 'Vision Fan 48"', customer: 'Rashid Khan', expiryDate: '2026-08-22', daysRemaining: 12 }, { id: 'WAR-112', uniqueId: 'BULB-99001', product: 'LED Bulb 20W', customer: 'Khadija Bibi', expiryDate: '2026-08-30', daysRemaining: 20 },
    ],
  };
}

export async function getAdminProductItems(query?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<AdminProductItem[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const params = new URLSearchParams();
    params.set("page", String(query?.page || 1));
    params.set("limit", String(query?.limit || 20));
    if (query?.search && query.search.trim()) params.set("search", query.search.trim());
    if (query?.status && query.status !== "ALL") params.set("status", query.status);

    const res = await fetch(`${API_URL}/products/items?${params.toString()}`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch product items:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("[getAdminProductItems] error:", error);
    return [];
  }
}

export async function deleteAdminProductItem(itemId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/products/items/${itemId}`, {
    method: "DELETE",
    headers,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || "Failed to delete product item");
  }

  return { success: true, message: "Product item deleted successfully", itemId };
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  return [
    { categoryId: '1', name: 'Electronics', slug: 'electronics', level: 'Parent', status: 'Active' },
    { categoryId: '2', name: 'Mobile Phones', slug: 'mobile-phones', level: 'Child (Electronics)', status: 'Active' },
    { categoryId: '3', name: 'Furniture', slug: 'furniture', level: 'Parent', status: 'Active' },
  ];
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  return [
    { id: 'ORD-9021', customerName: 'Ariful Islam', customerEmail: 'arif@example.com', customerPhone: '01711223344', totalAmount: 4850, status: 'Processing', paymentStatus: 'Paid', paymentMethod: 'Cash on Delivery', date: '2026-08-10', itemsCount: 2 },
    { id: 'ORD-9022', customerName: 'Nusrat Jahan', customerEmail: 'nusrat@example.com', customerPhone: '01822334455', totalAmount: 12500, status: 'Pending', paymentStatus: 'Pending', paymentMethod: 'Cash on Delivery', date: '2026-08-09', itemsCount: 1 },
    { id: 'ORD-9023', customerName: 'Mahmud Hasan', customerEmail: 'mahmud@example.com', customerPhone: '01933445566', totalAmount: 3500, status: 'Delivered', paymentStatus: 'Paid', paymentMethod: 'Cash on Delivery', date: '2026-08-07', itemsCount: 1 },
    { id: 'ORD-9024', customerName: 'Sabrina Chowdhury', customerEmail: 'sabrina@example.com', customerPhone: '01644556677', totalAmount: 8900, status: 'Shipped', paymentStatus: 'Paid', paymentMethod: 'Cash on Delivery', date: '2026-08-06', itemsCount: 3 },
    { id: 'ORD-9025', customerName: 'Zahid Rahman', customerEmail: 'zahid@example.com', customerPhone: '01555667788', totalAmount: 2200, status: 'Cancelled', paymentStatus: 'Failed', paymentMethod: 'Cash on Delivery', date: '2026-08-05', itemsCount: 1 },
  ];
}

export async function getAdminOrderDetails(id: string): Promise<AdminOrder> {
  return {
    id,
    orderNumber: `ORD-${id.slice(-4)}`,
    customerName: 'Ariful Islam', customerEmail: 'arif@example.com', customerPhone: '01711223344',
    shippingAddress: 'House 42, Road 11, Block D, Banani, Dhaka 1213',
    notes: 'Please call before delivery.', total: 4850, subtotal: 4500, tax: 250, shipping: 100, discount: 0,
    totalAmount: 4850, status: 'Processing', paymentStatus: 'Paid', paymentMethod: 'Cash on Delivery', date: '2026-08-10',
    items: [
      { id: 'item_1', name: 'Vision 56" Ceiling Fan', productId: 'prod_1', productItemId: 'FAN-001928', price: 3500, quantity: 1, total: 3500, warrantyMonths: 24, serialNumber: 'SN-99021', image: '/images/fan.jpg' },
      { id: 'item_2', name: 'LED Bulb 15W (Pack of 4)', productId: 'prod_2', productItemId: 'BULB-15W-001', price: 1000, quantity: 1, total: 1000, warrantyMonths: 12, serialNumber: 'SN-77312', image: '/images/bulb.jpg' },
    ],
  };
}

export async function getAdminWarranties(): Promise<AdminWarranty[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/warranties?limit=100`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch warranties from backend:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    const rawWarranties: any[] = Array.isArray(json.data) ? json.data : [];

    return rawWarranties.map((w) => {
      const serial = w.productItem?.serialNumber || w.uniqueId || w.id;
      const productName = w.productItem?.variant?.product?.name || "Product";
      
      let customerName = "Walk-in Customer";
      let customerPhone = "N/A";
      if (w.customer?.user?.name) {
        customerName = w.customer.user.name;
        customerPhone = w.customer.user.phone || "N/A";
      } else if (w.productItem?.offlineSale?.customerName) {
        customerName = w.productItem.offlineSale.customerName;
        customerPhone = w.productItem.offlineSale.customerPhone || "N/A";
      } else if (w.onlineOrder?.shippingAddress) {
        try {
          const addr = typeof w.onlineOrder.shippingAddress === 'string' 
            ? JSON.parse(w.onlineOrder.shippingAddress) 
            : w.onlineOrder.shippingAddress;
          customerName = addr?.name || addr?.recipientName || "Online Customer";
          customerPhone = addr?.phone || addr?.recipientPhone || "N/A";
        } catch {
          customerName = "Online Customer";
        }
      }

      const sellerName = w.seller?.companyName || w.seller?.user?.name || (w.saleType === "ONLINE" ? "JEE Central Warehouse" : "Official Merchant");
      const saleType = w.saleType ? (w.saleType.charAt(0).toUpperCase() + w.saleType.slice(1).toLowerCase()) : "Online";
      
      const rawStatus = (w.status || "ACTIVE").toUpperCase();
      let status = "Active";
      if (rawStatus === "CLAIMED") status = "Claimed";
      else if (rawStatus === "EXPIRED") status = "Expired";
      else if (rawStatus === "VOID") status = "Void";
      else if (rawStatus === "ACTIVE") status = "Active";
      else status = rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase();

      const startDate = w.startDate ? new Date(w.startDate).toISOString().split("T")[0] : "N/A";
      const endDate = w.endDate ? new Date(w.endDate).toISOString().split("T")[0] : "N/A";
      const claimsCount = Number(w._count?.claims ?? w.claims?.length ?? 0);

      return {
        id: w.id,
        uniqueId: serial,
        serialNumber: serial,
        productName,
        customerName,
        customerPhone,
        sellerName,
        saleType,
        status,
        rawStatus,
        startDate,
        endDate,
        claimsCount,
        terms: w.terms || null,
      };
    });
  } catch (error) {
    console.error("[getAdminWarranties] error:", error);
    return [];
  }
}

export async function getAdminWarrantyClaims(): Promise<AdminWarrantyClaim[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/warranty-claims?limit=100`, {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch warranty claims from backend:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    const rawClaims: any[] = Array.isArray(json.data) ? json.data : [];

    return rawClaims.map((claim) => {
      const serial = claim.warranty?.productItem?.serialNumber || claim.uniqueId || "N/A";
      const productName = claim.warranty?.productItem?.variant?.product?.name || "Product";
      
      let customerName = "Customer";
      let customerPhone = "N/A";
      if (claim.warranty?.customer?.user?.name) {
        customerName = claim.warranty.customer.user.name;
        customerPhone = claim.warranty.customer.user.phone || "N/A";
      } else if (claim.warranty?.productItem?.offlineSale?.customerName) {
        customerName = claim.warranty.productItem.offlineSale.customerName;
        customerPhone = claim.warranty.productItem.offlineSale.customerPhone || "N/A";
      }

      const rawStatus = (claim.status || "SUBMITTED").toUpperCase();
      let displayStatus = "Submitted";
      if (rawStatus === "APPROVED") displayStatus = "Approved";
      else if (rawStatus === "UNDER_REPAIR" || rawStatus === "UNDER_REVIEW" || rawStatus === "IN_PROGRESS") displayStatus = "In Progress";
      else if (rawStatus === "COMPLETED") displayStatus = "Completed";
      else if (rawStatus === "REJECTED") displayStatus = "Rejected";
      else if (rawStatus === "CANCELLED") displayStatus = "Cancelled";
      else displayStatus = rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase();

      const dateSubmitted = claim.submittedAt 
        ? new Date(claim.submittedAt).toISOString().split("T")[0]
        : claim.createdAt 
          ? new Date(claim.createdAt).toISOString().split("T")[0] 
          : "N/A";

      return {
        id: claim.id,
        claimNumber: claim.claimNumber || `CLM-${claim.id.slice(-6).toUpperCase()}`,
        warrantyId: claim.warrantyId,
        uniqueId: serial,
        productName,
        customerName,
        customerPhone,
        issueDescription: claim.description || "No description provided",
        dateSubmitted,
        status: displayStatus,
        rawStatus,
        resolutionNotes: claim.resolution || "",
        claimAmount: claim.claimAmount ? Number(claim.claimAmount) : undefined,
      };
    });
  } catch (error) {
    console.error("[getAdminWarrantyClaims] error:", error);
    return [];
  }
}

export async function updateAdminUserRole(id: string, role: string) {
  const normalizedRole = role.toUpperCase();
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ role: normalizedRole }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to update user role to ${role}`);
  }

  return { success: true, message: json.message || `User role updated to ${role}`, id };
}

export async function updateAdminUserStatus(id: string, status: string) {
  const isActive = status.toUpperCase() === "ACTIVE";
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ isActive }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to update user status to ${status}`);
  }

  return { success: true, message: json.message || `User status changed to ${status}`, id };
}

export async function updateAdminSellerStatus(id: string, status: string) {
  const normalizedStatus = status.toUpperCase();
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/sellers/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status: normalizedStatus }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to update seller status to ${status}`);
  }

  return { success: true, message: json.message || `Seller status updated to ${status}`, id };
}

export async function bulkAddAdminProductItems(productId: string, items: Array<Record<string, unknown>>) {
  return { success: true, message: `${items.length} items added successfully.`, productId };
}

export async function updateAdminOrderStatus(id: string, status: string) {
  return { success: true, message: `Order #${id} status changed to ${status}` };
}

export async function updateAdminWarrantyStatus(id: string, status: string) {
  const normalizedStatus = status.toUpperCase();
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/warranties/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status: normalizedStatus }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to update warranty status to ${status}`);
  }

  return { success: true, message: json.message || `Warranty status updated to ${status}`, id };
}

export async function updateAdminWarrantyClaimStatus(id: string, status: string, resolutionNotes?: string) {
  let normalizedStatus = status.toUpperCase().replace(/\s+/g, '_');
  if (normalizedStatus === "IN_PROGRESS") {
    normalizedStatus = "UNDER_REPAIR";
  }

  const payload: Record<string, unknown> = {
    status: normalizedStatus,
  };
  if (resolutionNotes !== undefined) {
    payload.resolution = resolutionNotes;
  }

  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/warranty-claims/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to update warranty claim #${id} status`);
  }

  return { success: true, message: json.message || `Claim status updated to ${status}`, id, resolutionNotes };
}
