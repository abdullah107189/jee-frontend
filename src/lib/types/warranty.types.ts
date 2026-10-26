export type WarrantyStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "CLAIMED"
  | "VOID"
  | "UNSOLD"
  | "AVAILABLE";

export interface PublicWarrantyCheckResult {
  productName: string;
  variantAttributes?: Record<string, unknown> | null;
  status: WarrantyStatus;
  effectiveStatus?: WarrantyStatus;
  startDate?: string | null;
  endDate?: string | null;
  serialNumber?: string;
  isSold?: boolean;
  warrantyMonths?: number;
  warrantyTerms?: string | null;
  sku?: string;
  price?: number;
  brandName?: string;
  message?: string;
}

export interface PublicWarrantyCheckResponse {
  success: boolean;
  message?: string;
  data: PublicWarrantyCheckResult | null;
}
