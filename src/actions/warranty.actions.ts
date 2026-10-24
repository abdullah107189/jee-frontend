"use server";

import { checkWarranty } from "@/services/warranty.service";
import type { PublicWarrantyCheckResult } from "@/lib/types/warranty.types";

export interface CheckWarrantyActionResult {
  success: boolean;
  message?: string;
  data: PublicWarrantyCheckResult | null;
}

export async function checkWarrantyAction(
  serialNumber: string,
): Promise<CheckWarrantyActionResult> {
  const normalized = serialNumber?.trim().toUpperCase();
  if (!normalized || normalized.length < 3) {
    return {
      success: false,
      message: "Please enter a valid serial number (at least 3 characters).",
      data: null,
    };
  }

  if (!/^[A-Z0-9-]+$/i.test(normalized)) {
    return {
      success: false,
      message: "Serial number can only contain letters, numbers, and hyphens.",
      data: null,
    };
  }

  return await checkWarranty(normalized);
}