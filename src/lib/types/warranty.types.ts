export type WarrantyStatus = "ACTIVE" | "EXPIRED" | "CLAIMED" | "VOID";

export interface PublicWarrantyCheckResult {
  productName: string;
  variantAttributes: Record<string, unknown> | null;
  status: WarrantyStatus;
  effectiveStatus: WarrantyStatus;
  startDate: string;
  endDate: string;
  serialNumber?: string;
}

export interface PublicWarrantyCheckResponse {
  success: boolean;
  message?: string;
  data: PublicWarrantyCheckResult | null;
}
