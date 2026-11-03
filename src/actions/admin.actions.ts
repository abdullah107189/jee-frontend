'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/session';
import {
  bulkAddAdminProductItems,
  getDatabaseBackup,
  type SystemSettings,
  updateAdminOrderStatus,
  updateAdminSellerStatus,
  updateAdminUserRole,
  updateAdminUserStatus,
  updateAdminWarrantyClaimStatus,
  updateAdminWarrantyStatus,
  updateSystemSettings,
} from '@/services/admin.service';

type ActionResult = { success: boolean; message: string };

const USER_ROLES = new Set(['admin', 'seller', 'customer', 'ADMIN', 'SELLER', 'CUSTOMER']);
const USER_STATUSES = new Set(['Active', 'Disabled', 'ACTIVE', 'DISABLED']);
const SELLER_STATUSES = new Set(['Approved', 'Pending', 'Suspended', 'Disabled', 'APPROVED', 'PENDING', 'SUSPENDED', 'DISABLED']);
const ORDER_STATUSES = new Set(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']);
const WARRANTY_STATUSES = new Set(['Active', 'Claimed', 'Expired', 'Void', 'Transferred', 'ACTIVE', 'CLAIMED', 'EXPIRED', 'VOID', 'TRANSFERRED']);
const CLAIM_STATUSES = new Set(['Submitted', 'In Progress', 'Approved', 'Completed', 'Rejected', 'Under Review', 'Under Repair', 'Cancelled', 'SUBMITTED', 'IN_PROGRESS', 'APPROVED', 'COMPLETED', 'REJECTED', 'UNDER_REVIEW', 'UNDER_REPAIR', 'CANCELLED']);

function requiredText(value: unknown, field: string, maxLength = 120) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > maxLength) {
    throw new Error(`Invalid ${field}`);
  }
  return value.trim();
}

export async function updateUserRoleAction(input: { id: string; role: string }): Promise<ActionResult> {
  await requireRole('ADMIN');
  const id = requiredText(input?.id, 'user id');
  const role = requiredText(input?.role, 'role');
  if (!USER_ROLES.has(role)) throw new Error('Invalid user role');
  const result = await updateAdminUserRole(id, role);
  revalidatePath('/admin/users');
  return result;
}

export async function updateUserStatusAction(input: { id: string; status: string }): Promise<ActionResult> {
  await requireRole('ADMIN');
  const id = requiredText(input?.id, 'user id');
  const status = requiredText(input?.status, 'status');
  if (!USER_STATUSES.has(status)) throw new Error('Invalid user status');
  const result = await updateAdminUserStatus(id, status);
  revalidatePath('/admin/users');
  return result;
}

export async function updateSellerStatusAction(input: { id: string; status: string; reason?: string }): Promise<ActionResult> {
  await requireRole('ADMIN');
  const id = requiredText(input?.id, 'seller id');
  const status = requiredText(input?.status, 'status');
  if (!SELLER_STATUSES.has(status)) throw new Error('Invalid seller status');
  if (input.reason !== undefined) requiredText(input.reason, 'reason', 500);
  const result = await updateAdminSellerStatus(id, status);
  revalidatePath('/admin/sellers');
  revalidatePath('/admin/sellers/pending');
  return result;
}

export async function bulkAddProductItemsAction(input: { productId: string; items: Array<{ uniqueId: string; serialNumber?: string; status: string }> }): Promise<ActionResult> {
  await requireRole('ADMIN');
  const productId = requiredText(input?.productId, 'product id');
  if (!Array.isArray(input?.items) || input.items.length === 0 || input.items.length > 500) {
    throw new Error('Invalid product items');
  }

  const ids = new Set<string>();
  const items = input.items.map((item) => {
    const uniqueId = requiredText(item?.uniqueId, 'unique id', 100);
    if (!/^[A-Z0-9-]+$/.test(uniqueId) || ids.has(uniqueId)) throw new Error('Invalid or duplicate unique id');
    ids.add(uniqueId);
    const status = requiredText(item?.status, 'item status');
    if (!new Set(['AVAILABLE', 'RESERVED', 'DAMAGED']).has(status)) throw new Error('Invalid item status');
    return { ...item, uniqueId, status };
  });

  return bulkAddAdminProductItems(productId, items);
}

export async function updateOrderStatusAction(input: { id: string; status: string }): Promise<ActionResult> {
  await requireRole('ADMIN');
  const id = requiredText(input?.id, 'order id');
  const status = requiredText(input?.status, 'status');
  if (!ORDER_STATUSES.has(status)) throw new Error('Invalid order status');
  return updateAdminOrderStatus(id, status);
}

export async function updateWarrantyStatusAction(input: { id: string; status: string }): Promise<ActionResult> {
  await requireRole('ADMIN');
  const id = requiredText(input?.id, 'warranty id');
  const status = requiredText(input?.status, 'status');
  if (!WARRANTY_STATUSES.has(status)) throw new Error('Invalid warranty status');
  const result = await updateAdminWarrantyStatus(id, status);
  revalidatePath('/admin/warranties');
  return result;
}

export async function updateWarrantyClaimStatusAction(input: { id: string; status: string; resolutionNotes?: string }): Promise<ActionResult> {
  await requireRole('ADMIN');
  const id = requiredText(input?.id, 'claim id');
  const status = requiredText(input?.status, 'status');
  if (!CLAIM_STATUSES.has(status)) throw new Error('Invalid claim status');
  if (input.resolutionNotes !== undefined) requiredText(input.resolutionNotes, 'resolution notes', 2000);
  const result = await updateAdminWarrantyClaimStatus(id, status, input.resolutionNotes);
  revalidatePath('/admin/warranties/claims');
  revalidatePath('/admin/warranties');
  return result;
}

export async function updateSystemSettingsAction(
  input: Partial<SystemSettings>
): Promise<ActionResult & { data?: SystemSettings }> {
  await requireRole('ADMIN');
  const result = await updateSystemSettings(input);
  revalidatePath('/admin/settings');
  revalidatePath('/admin/homepage');
  revalidatePath('/admin/products');
  revalidatePath('/');
  return {
    success: true,
    message: result.message || 'System configuration saved successfully',
    data: result.data,
  };
}

export async function getDatabaseBackupAction(): Promise<{
  success: boolean;
  data: Record<string, unknown>;
}> {
  await requireRole('ADMIN');
  const data = await getDatabaseBackup();
  return { success: true, data };
}
