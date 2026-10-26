export interface SellerProfileData {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  country?: string;
  businessLicense: string;
  taxId?: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "DISABLED";
  joinedDate: string;
  stats?: {
    totalSales: number;
    totalRevenue: number;
    activeWarranties: number;
  };
}

export interface SellerSaleItem {
  id: string;
  invoiceNumber: string;
  uniqueId: string;
  serialNumber: string;
  product: string;
  productName: string;
  amount: number;
  salePrice: number;
  discount: number;
  tax: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER" | "OTHER";
  date: string;
  createdAt: string;
  price?: number;
  status?: string;
  warrantyStatus: string;
  warrantyId?: string;
}

export interface SellerSaleDetail extends SellerSaleItem {
  notes?: string;
  sku?: string;
  variantAttributes?: Record<string, any>;
  warranty?: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    warrantyMonths: number;
    terms?: string;
  };
}

export interface SellerWarrantyItem {
  id: string;
  uniqueId: string;
  serialNumber: string;
  productName: string;
  sku?: string;
  customerName: string;
  customerPhone: string;
  status: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  saleAmount?: number;
  paymentMethod?: string;
  saleInformation?: {
    date?: string;
    amount?: number;
    payment?: string;
  };
  claimHistory?: Array<{
    claimId?: string;
    status: string;
    type: string;
    notes?: string;
    date: string;
  }>;
}

export interface SellerDashboardStats {
  todaysSales: number;
  todaysSalesCount: number;
  totalSalesAmount: number;
  totalOrders: number;
  activeWarranties: number;
  pendingClaims: number;
  salesByCategory: Array<{ category: string; count: number }>;
  recentSales: SellerSaleItem[];
}

export interface CreateOfflineSalePayload {
  serialNumber: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  salePrice: number;
  discount?: number;
  tax?: number;
  paymentMethod?: "CASH" | "CARD" | "BANK_TRANSFER" | "OTHER";
  notes?: string;
}
