export type PaymentWay = "COD" | "FULL";

export interface CreateOrderItem {
  variantId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: CreateOrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    email?: string;
    divisionId?: string;
    divisionName?: string;
    districtId?: string;
    districtName?: string;
    upazilaId?: string;
    upazilaName?: string;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    fullAddress?: string;
  };
  paymentWay: PaymentWay;
  shipping: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}