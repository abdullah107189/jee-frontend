import "server-only";
import type {
  PublicWarrantyCheckResponse,
  PublicWarrantyCheckResult,
} from "@/lib/types/warranty.types";

export {
  getAdminWarrantyClaims,
  getAdminWarranties,
} from "./admin.service";

export type { AdminWarranty, AdminWarrantyClaim } from "./admin.service";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

export async function checkWarranty(
  serialNumber: string,
): Promise<{
  success: boolean;
  message?: string;
  data: PublicWarrantyCheckResult | null;
}> {
  try {
    const res = await fetch(
      `${API_URL}/warranties/check/${encodeURIComponent(serialNumber)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const json = (await res.json().catch(() => null)) as PublicWarrantyCheckResponse | null;

    if (!res.ok || !json?.success || !json?.data) {
      return {
        success: false,
        message: json?.message || "Warranty not found for this serial number.",
        data: null,
      };
    }

    return {
      success: true,
      message: json.message,
      data: {
        ...json.data,
        serialNumber,
      },
    };
  } catch (error) {
    console.error("[checkWarranty]", error);
    return {
      success: false,
      message: "Network error. Please try again later.",
      data: null,
    };
  }
}