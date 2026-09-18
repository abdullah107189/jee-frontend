/* -------------------------------------------------------------------------- */
/* Order                                                                      */
/* -------------------------------------------------------------------------- */
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

/* -------------------------------------------------------------------------- */
/* Payment                                                                    */
/* -------------------------------------------------------------------------- */
export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIAL";

export type PaymentMethod = "Bkash" | "Nagad" | "Rocket";

export type PaymentVerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

/* -------------------------------------------------------------------------- */
/* Warranty                                                                   */
/* -------------------------------------------------------------------------- */
export type WarrantyStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "VOID"
  | "CLAIMED"
  | "TRANSFERRED";

export type ClaimStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "UNDER_REPAIR"
  | "COMPLETED"
  | "CANCELLED";

export type ClaimLimitType = "LIMITED" | "UNLIMITED";

export type SaleType = "ONLINE" | "OFFLINE";

/* -------------------------------------------------------------------------- */
/* User                                                                       */
/* -------------------------------------------------------------------------- */
export type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";

export type SellerStatus =
  | "PENDING"
  | "APPROVED"
  | "SUSPENDED"
  | "DISABLED";

/* -------------------------------------------------------------------------- */
/* Product item                                                               */
/* -------------------------------------------------------------------------- */
export type ProductItemStatus =
  | "AVAILABLE"
  | "SOLD"
  | "RESERVED"
  | "DAMAGED"
  | "RETURNED"
  | "UNDER_REPAIR";