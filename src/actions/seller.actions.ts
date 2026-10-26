"use server";

import { requireRole } from "@/lib/auth/session";
import {
  changeSellerPassword,
  recordSellerOfflineSale,
  updateSellerProfile,
  validateSellerProductItem,
} from "@/services/seller.service";
import { revalidatePath } from "next/cache";

function text(value: unknown, field: string, max = 200) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new Error(`Invalid ${field}`);
  return value.trim();
}

export async function validateProductItemAction(uniqueId: string) {
  await requireRole("SELLER");
  const id = text(uniqueId, "serial number", 100);
  if (!/^[A-Z0-9-]+$/i.test(id)) throw new Error("Invalid serial number format");
  return validateSellerProductItem(id);
}

export async function recordOfflineSaleAction(input: Record<string, any>) {
  await requireRole("SELLER");
  const serialNumber = text(input?.serialNumber || input?.uniqueId, "serial number");
  
  const rawCustomerName = typeof input?.customerName === "string" ? input.customerName.trim() : "";
  const customerName = rawCustomerName || "Walk-in Customer";

  const rawPhone = typeof input?.customerPhone === "string" ? input.customerPhone.trim() : "";
  if (rawPhone && !/^01[3-9]\d{8}$/.test(rawPhone)) {
    throw new Error("Invalid customer phone format (e.g. 01712345678)");
  }
  const customerPhone = rawPhone || undefined;

  if (!Number.isFinite(Number(input?.salePrice)) || Number(input.salePrice) < 0) {
    throw new Error("Invalid sale price");
  }

  const res = await recordSellerOfflineSale({
    serialNumber,
    customerName,
    customerPhone,
    customerEmail: input?.customerEmail ? String(input.customerEmail).trim() : undefined,
    salePrice: Number(input.salePrice),
    discount: Number(input?.discount || 0),
    tax: Number(input?.tax || 0),
    paymentMethod: input?.paymentMethod || "CASH",
    notes: input?.notes ? String(input.notes).trim() : undefined,
  });

  revalidatePath("/seller");
  revalidatePath("/seller/sales");
  revalidatePath("/seller/warranties");

  return res;
}

export async function recordBatchOfflineSalesAction(input: {
  items: Array<{
    serialNumber: string;
    salePrice: number;
    discount?: number;
    tax?: number;
  }>;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: "CASH" | "CARD" | "BANK_TRANSFER" | "OTHER";
  notes?: string;
}) {
  await requireRole("SELLER");

  if (!Array.isArray(input?.items) || input.items.length === 0) {
    throw new Error("At least one product item is required for offline sale");
  }

  const rawCustomerName = typeof input?.customerName === "string" ? input.customerName.trim() : "";
  const customerName = rawCustomerName || "Walk-in Customer";

  const rawPhone = typeof input?.customerPhone === "string" ? input.customerPhone.trim() : "";
  if (rawPhone && !/^01[3-9]\d{8}$/.test(rawPhone)) {
    throw new Error("Invalid customer phone format (e.g. 01712345678)");
  }
  const customerPhone = rawPhone || undefined;
  const customerEmail = input?.customerEmail ? String(input.customerEmail).trim() : undefined;
  const paymentMethod = input?.paymentMethod || "CASH";
  const notes = input?.notes ? String(input.notes).trim() : undefined;

  const results: any[] = [];
  const errors: string[] = [];

  for (const item of input.items) {
    try {
      const serialNumber = text(item.serialNumber, "serial number");
      const salePrice = Number(item.salePrice);
      if (!Number.isFinite(salePrice) || salePrice < 0) {
        throw new Error(`Invalid price for serial ${serialNumber}`);
      }
      const res = await recordSellerOfflineSale({
        serialNumber,
        customerName,
        customerPhone,
        customerEmail,
        salePrice,
        discount: Number(item.discount || 0),
        tax: Number(item.tax || 0),
        paymentMethod,
        notes,
      });
      results.push(res);
    } catch (err: any) {
      errors.push(err?.message || `Failed to record sale for ${item.serialNumber}`);
    }
  }

  revalidatePath("/seller");
  revalidatePath("/seller/sales");
  revalidatePath("/seller/warranties");

  if (results.length === 0 && errors.length > 0) {
    const uniqueErrors = Array.from(new Set(errors));
    throw new Error(uniqueErrors.join("; "));
  }

  return {
    success: true,
    totalCount: input.items.length,
    recordedCount: results.length,
    results,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export async function updateSellerProfileAction(input: Record<string, string>) {
  await requireRole("SELLER");
  const profile = {
    companyName: text(input?.companyName, "company name"),
    ownerName: text(input?.ownerName, "owner name"),
    phone: text(input?.phone, "phone"),
    address: text(input?.address, "address"),
    businessLicense: text(input?.businessLicense, "business license"),
  };

  if (
    !/^\+?\d{10,15}$/.test(profile.phone) &&
    !/^01[3-9]\d{8}$/.test(profile.phone)
  ) {
    throw new Error("Invalid phone number format");
  }

  const res = await updateSellerProfile(profile);
  revalidatePath("/seller/profile");
  return res;
}

export async function changeSellerPasswordAction(input: {
  currentPassword: string;
  newPassword: string;
}) {
  await requireRole("SELLER");
  text(input?.currentPassword, "current password");
  const newPassword = text(input?.newPassword, "new password");
  if (newPassword.length < 6)
    throw new Error("Password must be at least 6 characters");
  return changeSellerPassword();
}
