export type PaymentWay = "COD" | "FULL";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatus =
  | "PENDING"
  | "SUBMITTED"
  | "PAID"
  | "REJECTED"
  | "REFUNDED";

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

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  divisionId?: string;
  divisionName?: string;
  districtId?: string;
  districtName?: string;
  upazilaId?: string;
  upazilaName?: string;
  addressLine1?: string;
  addressLine2?: string;
  streetAddress?: string;
  apartment?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  fullAddress?: string;
  address?: string;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  variantId?: string;
  productItemId?: string;
  quantity: number;
  price: number;
  total?: number;
  unitPrice?: number;
  totalPrice?: number;
  name?: string;
  image?: string;
  serialNumber?: string;
  warrantyMonths?: number;
  warrantyStatus?: string;
  product?: {
    id: string;
    name: string;
    slug?: string;
    images?: string[];
    warrantyMonths?: number;
  };
  variant?: {
    id: string;
    name?: string;
    image?: string;
    sku?: string;
    color?: string;
    size?: string;
    price?: number;
    images?: string[];
    product?: {
      id: string;
      name: string;
      slug?: string;
      images?: string[];
      warrantyMonths?: number;
      warrantyTerms?: string;
    };
  };
}

export interface OrderCustomer {
  id?: string;
  userId?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus | string;
  date: string;
  title?: string;
  notes?: string;
  completed?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerId?: string;
  customer?: OrderCustomer;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  itemCount?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentWay: PaymentWay;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax?: number;
  shipping: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  courierName?: string;
  consignmentId?: string;
  trackingUrl?: string;
  courierStatus?: string;
  orderedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt?: string;
  timeline?: OrderTimelineEvent[];
}

export interface CustomerOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CancelOrderActionState {
  success: boolean;
  message: string;
  orderId?: string;
}