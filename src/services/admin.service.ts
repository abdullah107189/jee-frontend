import "server-only";

import { cookies, headers } from "next/headers";

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
    Cookie: cookieStore.toString(),
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

export type AuditLog = Record<string, any>;
export type AdminAnalytics = Record<string, any>;

export type AdminOrder = Record<string, any>;
export type AdminWarranty = Record<string, any>;
 
export type AdminProductItem = Record<string, any>;
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

export async function getAuditLogs(): Promise<AuditLog[]> {
  return [
    { id: 'LOG-991', timestamp: '2026-08-10 08:30:12', user: 'Admin System', userEmail: 'admin@JEE.bd', action: 'SELLER_APPROVED', entity: 'Seller (sel_3)', details: 'Approved seller Chittagong Electronics Hub', ipAddress: '103.204.244.12' },
    { id: 'LOG-990', timestamp: '2026-08-10 07:15:45', user: 'Tanvir Hossain', userEmail: 'tanvir@electrotech.bd', action: 'OFFLINE_SALE', entity: 'ProductItem (FAN-001928)', details: 'Recorded offline sale & activated 12M warranty', ipAddress: '103.112.54.89' },
    { id: 'LOG-989', timestamp: '2026-08-09 19:40:02', user: 'Ariful Islam', userEmail: 'arif@example.com', action: 'ONLINE_ORDER', entity: 'Order (#ORD-9021)', details: 'Placed online order via Cash on Delivery', ipAddress: '119.30.38.100' },
    { id: 'LOG-988', timestamp: '2026-08-09 14:22:18', user: 'Admin System', userEmail: 'admin@JEE.bd', action: 'PRODUCT_CREATED', entity: 'Product (prod_99)', details: 'Created product: Vision Smart LED TV 43"', ipAddress: '103.204.244.12' },
    { id: 'LOG-987', timestamp: '2026-08-09 11:05:00', user: 'Admin System', userEmail: 'admin@JEE.bd', action: 'BULK_ITEM_ADD', entity: 'ProductItems (50 units)', details: 'Bulk imported 50 ProductItems for SKU FAN-001', ipAddress: '103.204.244.12' },
    { id: 'LOG-986', timestamp: '2026-08-08 16:50:33', user: 'Alice Smith', userEmail: 'alice@example.com', action: 'WARRANTY_CLAIM', entity: 'Claim (#CLM-501)', details: 'Submitted warranty claim for AC-100293', ipAddress: '203.82.199.45' },
    { id: 'LOG-985', timestamp: '2026-08-08 09:00:10', user: 'Rafiqul Islam', userEmail: 'vision.store@example.com', action: 'USER_LOGIN', entity: 'Auth', details: 'Successful seller login session', ipAddress: '103.112.54.90' },
  ];
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

export async function getAdminProductItems(): Promise<AdminProductItem[]> {
  return [
    { id: '1', productName: 'Premium Standing Desk', uniqueId: 'FAN-001', serialNumber: 'SN-001', status: 'AVAILABLE', createdAt: '2023-10-24' },
    { id: '2', productName: 'Premium Standing Desk', uniqueId: 'FAN-002', serialNumber: 'SN-002', status: 'SOLD', createdAt: '2023-10-24' },
    { id: '3', productName: 'Ergonomic Chair', uniqueId: 'CHR-001', serialNumber: 'SN-003', status: 'RESERVED', createdAt: '2023-10-25' },
    { id: '4', productName: 'Ergonomic Chair', uniqueId: 'CHR-002', serialNumber: 'SN-004', status: 'DAMAGED', createdAt: '2023-10-25' },
  ];
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
  return [
    { id: 'WAR-101', uniqueId: 'FAN-001928', productName: 'Vision 56" Ceiling Fan', customerName: 'John Doe', customerPhone: '01711223344', sellerName: 'Vision Official Store', saleType: 'Offline', status: 'Active', startDate: '2026-01-15', endDate: '2027-01-15', claimsCount: 0 },
    { id: 'WAR-102', uniqueId: 'AC-100293', productName: 'Vision AC 1.5 Ton', customerName: 'Alice Smith', customerPhone: '01899887766', sellerName: 'Electro Tech Dhaka', saleType: 'Online', status: 'Active', startDate: '2026-03-10', endDate: '2028-03-10', claimsCount: 1 },
    { id: 'WAR-103', uniqueId: 'BULB-99212', productName: 'LED Bulb 15W', customerName: 'Karim Ahmed', customerPhone: '01900112233', sellerName: 'Direct Online', saleType: 'Expired', status: 'Expired', startDate: '2024-05-01', endDate: '2025-05-01', claimsCount: 0 },
    { id: 'WAR-104', uniqueId: 'IRON-20211', productName: 'Dry Iron 1000W', customerName: 'Farid Hossain', customerPhone: '01511223344', sellerName: 'Bogra Smart Gadgets', saleType: 'Offline', status: 'Claimed', startDate: '2025-08-10', endDate: '2026-08-10', claimsCount: 2 },
    { id: 'WAR-105', uniqueId: 'BLENDER-331', productName: 'Super Blender 750W', customerName: 'Sumaiya Begum', customerPhone: '01399887766', sellerName: 'Sylhet Digital', saleType: 'Offline', status: 'Void', startDate: '2025-10-01', endDate: '2026-10-01', claimsCount: 1 },
  ];
}

export async function getAdminWarrantyClaims(): Promise<AdminWarrantyClaim[]> {
  return [
    { id: 'CLM-501', warrantyId: 'WAR-102', uniqueId: 'AC-100293', productName: 'Vision AC 1.5 Ton', customerName: 'Alice Smith', customerPhone: '01899887766', issueDescription: 'Cooling insufficient after 4 months of usage. Compressor making noise.', dateSubmitted: '2026-08-02', status: 'In Progress', resolutionNotes: 'Technician assigned for on-site inspection.' },
    { id: 'CLM-502', warrantyId: 'WAR-104', uniqueId: 'IRON-20211', productName: 'Dry Iron 1000W', customerName: 'Farid Hossain', customerPhone: '01511223344', issueDescription: 'Heating element burnt out.', dateSubmitted: '2026-07-20', status: 'Completed', resolutionNotes: 'Replaced heating element under warranty terms.' },
    { id: 'CLM-503', warrantyId: 'WAR-105', uniqueId: 'BLENDER-331', productName: 'Super Blender 750W', customerName: 'Sumaiya Begum', customerPhone: '01399887766', issueDescription: 'Motor damaged due to liquid entry.', dateSubmitted: '2026-07-15', status: 'Rejected', resolutionNotes: 'Physical & liquid damage not covered under warranty policy.' },
    { id: 'CLM-504', warrantyId: 'WAR-101', uniqueId: 'FAN-001928', productName: 'Vision 56" Ceiling Fan', customerName: 'John Doe', customerPhone: '01711223344', issueDescription: 'Speed regulator coil defect.', dateSubmitted: '2026-08-09', status: 'Submitted', resolutionNotes: '' },
  ];
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
  return { success: true, message: `Warranty status updated to ${status}`, id };
}

export async function updateAdminWarrantyClaimStatus(id: string, status: string, resolutionNotes?: string) {
  return { success: true, message: `Claim #${id} status updated to ${status}`, resolutionNotes };
}
