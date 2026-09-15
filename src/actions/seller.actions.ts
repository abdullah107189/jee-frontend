'use server';

import { requireRole } from '@/services/auth.service';
import { changeSellerPassword, recordSellerOfflineSale, updateSellerProfile, validateSellerProductItem } from '@/services/seller.service';

function text(value: unknown, field: string, max = 200) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(`Invalid ${field}`);
  return value.trim();
}

export async function validateProductItemAction(uniqueId: string) {
  await requireRole('seller');
  const id = text(uniqueId, 'unique id', 100);
  if (!/^[A-Z0-9-]+$/.test(id)) throw new Error('Invalid product item id');
  if (['INVALID', 'NOTFOUND', 'EXPIRED'].includes(id)) throw new Error('Product item not found or unavailable');
  return validateSellerProductItem(id);
}

export async function recordOfflineSaleAction(input: Record<string, any>) {
  await requireRole('seller');
  const uniqueId = text(input?.uniqueId, 'unique id');
  const customerName = text(input?.customerName, 'customer name');
  const customerPhone = text(input?.customerPhone, 'customer phone');
  if (!/^01[3-9]\d{8}$/.test(customerPhone)) throw new Error('Invalid customer phone');
  if (!Number.isFinite(Number(input?.salePrice)) || Number(input.salePrice) < 0) throw new Error('Invalid sale price');
  if (!Number.isInteger(input?.warrantyMonths) || input.warrantyMonths < 1 || input.warrantyMonths > 240) throw new Error('Invalid warranty period');
  return recordSellerOfflineSale({ ...input, uniqueId, customerName, customerPhone, salePrice: Number(input.salePrice) });
}

export async function updateSellerProfileAction(input: Record<string, string>) {
  await requireRole('seller');
  const profile = { companyName: text(input?.companyName, 'company name'), ownerName: text(input?.ownerName, 'owner name'), phone: text(input?.phone, 'phone'), address: text(input?.address, 'address'), businessLicense: text(input?.businessLicense, 'business license') };
  if (!/^\+?\d{10,15}$/.test(profile.phone) && !/^01[3-9]\d{8}$/.test(profile.phone)) throw new Error('Invalid phone');
  return updateSellerProfile(profile);
}

export async function changeSellerPasswordAction(input: { currentPassword: string; newPassword: string }) {
  await requireRole('seller');
  text(input?.currentPassword, 'current password');
  const newPassword = text(input?.newPassword, 'new password');
  if (newPassword.length < 6) throw new Error('Password must be at least 6 characters');
  return changeSellerPassword();
}