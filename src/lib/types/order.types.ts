// lib/types/order.types.ts

export interface CreateOrderRequest {
  items: {
    productItemId: string;
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zipCode?: string;
  };
  paymentMethod: 'BKASH' | 'COD';
  bKashData?: {
    bKashNumber: string;
    transactionId: string;
  };
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  data: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    // ... other fields
  };
}

export interface VerifyRequest {
  bKashNumber: string;
  transactionId: string;
  amount: number;
}

export interface VerifyResponse {
  success: boolean;
  data: {
    verified: boolean;
    message: string;
  };
}