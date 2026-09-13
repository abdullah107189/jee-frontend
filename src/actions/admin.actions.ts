'use server';

import { requireRole } from '@/services/auth.service';
import {
  bulkAddAdminProductItems,
  updateAdminOrderStatus,
  updateAdminSellerStatus,
  updateAdminUserRole,
  updateAdminUserStatus,
  updateAdminWarrantyClaimStatus,
  updateAdminWarrantyStatus,
  verifyAdminOrderPayment,
} from '@/services/admin.service';

type ActionResult = { success: boolean; message: string };

const USER_ROLES = new Set(['admin', 'seller', 'customer']);
const USER_STATUSES = new Set(['Active', 'Disabled']);
const SELLER_STATUSES = new Set(['Approved', 'Pending', 'Suspended', 'Disabled']);
const ORDER_STATUSES = new Set(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']);
const WARRANTY_STATUSES = new Set(['Active', 'Claimed', 'Expired', 'Void']);
const CLAIM_STATUSES = new Set(['Submitted', 'In Progress', 'Approved', 'Completed', 'Rejected']);

function requiredText(value: unknown, field: string, maxLength = 120) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > maxLength) {
    throw new Error(`Invalid ${field}`);
  }
  return value.trim();
}

export async function updateUserRoleAction(input: { id: string; role: string }): Promise<ActionResult> {
  await requireRole('admin');
  const id = requiredText(input?.id, 'user id');
  const role = requiredText(input?.role, 'role');
  if (!USER_ROLES.has(role)) throw new Error('Invalid user role');
  return updateAdminUserRole(id, role);
}

export async function updateUserStatusAction(input: { id: string; status: string }): Promise<ActionResult> {
  await requireRole('admin');
  const id = requiredText(input?.id, 'user id');
  const status = requiredText(input?.status, 'status');
  if (!USER_STATUSES.has(status)) throw new Error('Invalid user status');
  return updateAdminUserStatus(id, status);
}

export async function updateSellerStatusAction(input: { id: string; status: string; reason?: string }): Promise<ActionResult> {
  await requireRole('admin');
  const id = requiredText(input?.id, 'seller id');
  const status = requiredText(input?.status, 'status');
  if (!SELLER_STATUSES.has(status)) throw new Error('Invalid seller status');
  if (input.reason !== undefined) requiredText(input.reason, 'reason', 500);
  return updateAdminSellerStatus(id, status);
}

export async function bulkAddProductItemsAction(input: { productId: string; items: Array<{ uniqueId: string; serialNumber?: string; status: string }> }): Promise<ActionResult> {
  await requireRole('admin');
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
  await requireRole('admin');
  const id = requiredText(input?.id, 'order id');
  const status = requiredText(input?.status, 'status');
  if (!ORDER_STATUSES.has(status)) throw new Error('Invalid order status');
  return updateAdminOrderStatus(id, status);
}

export async function verifyOrderPaymentAction(input: { id: string; verified: boolean }): Promise<ActionResult> {
  await requireRole('admin');
  const id = requiredText(input?.id, 'order id');
  if (typeof input?.verified !== 'boolean') throw new Error('Invalid payment verification value');
  return verifyAdminOrderPayment(id, input.verified);
}

export async function updateWarrantyStatusAction(input: { id: string; status: string }): Promise<ActionResult> {
  await requireRole('admin');
  const id = requiredText(input?.id, 'warranty id');
  const status = requiredText(input?.status, 'status');
  if (!WARRANTY_STATUSES.has(status)) throw new Error('Invalid warranty status');
  return updateAdminWarrantyStatus(id, status);
}

export async function updateWarrantyClaimStatusAction(input: { id: string; status: string; resolutionNotes?: string }): Promise<ActionResult> {
  await requireRole('admin');
  const id = requiredText(input?.id, 'claim id');
  const status = requiredText(input?.status, 'status');
  if (!CLAIM_STATUSES.has(status)) throw new Error('Invalid claim status');
  if (input.resolutionNotes !== undefined) requiredText(input.resolutionNotes, 'resolution notes', 2000);
  return updateAdminWarrantyClaimStatus(id, status, input.resolutionNotes);
}