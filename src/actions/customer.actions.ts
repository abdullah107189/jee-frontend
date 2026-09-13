'use server';

import { requireRole } from '@/services/auth.service';
import {
  changeCustomerPassword,
  createCustomerOrder,
  submitCustomerWarrantyClaim,
  updateCustomerProfile,
  verifyCustomerBkash,
} from '@/services/customer.service';

function text(value: unknown, field: string, max = 200) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(`Invalid ${field}`);
  return value.trim();
}

export async function createOrderAction(input: Record<string, any>) {
  await requireRole('customer');
  if (!Array.isArray(input?.items) || !input.items.length) throw new Error('Order must contain items');
  const items = input.items.map((item: any) => {
    const productItemId = text(item?.productItemId, 'product item id');
    if (!Number.isInteger(item?.quantity) || item.quantity < 1 || item.quantity > 100) throw new Error('Invalid quantity');
    return { productItemId, quantity: item.quantity };
  });
  const address = input.shippingAddress;
  const shippingAddress = {
    fullName: text(address?.fullName, 'full name'), phone: text(address?.phone, 'phone'), address: text(address?.address, 'address'), city: text(address?.city, 'city'), zipCode: address?.zipCode ? text(address.zipCode, 'zip code', 20) : undefined,
  };
  if (!['BKASH', 'COD'].includes(input.paymentMethod)) throw new Error('Invalid payment method');
  return createCustomerOrder({ ...input, items, shippingAddress, paymentMethod: input.paymentMethod });
}

export async function verifyBkashAction(input: { bKashNumber: string; transactionId: string; amount: number }) {
  await requireRole('customer');
  const bKashNumber = text(input?.bKashNumber, 'bKash number');
  const transactionId = text(input?.transactionId, 'transaction id', 100);
  if (!/^01[3-9]\d{8}$/.test(bKashNumber) || transactionId.length < 5 || input.amount !== 70) throw new Error('Invalid payment data');
  return verifyCustomerBkash(bKashNumber, transactionId, 70);
}

export async function updateCustomerProfileAction(input: Record<string, string>) {
  await requireRole('customer');
  const profile = { name: text(input?.name, 'name'), email: text(input?.email, 'email'), phone: text(input?.phone, 'phone'), address: text(input?.address, 'address'), city: text(input?.city, 'city'), zipCode: input?.zipCode ? text(input.zipCode, 'zip code', 20) : '' };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profile.email) || !/^01[3-9]\d{8}$/.test(profile.phone)) throw new Error('Invalid profile fields');
  return updateCustomerProfile(profile);
}

export async function changeCustomerPasswordAction(input: { currentPassword: string; newPassword: string }) {
  await requireRole('customer');
  text(input?.currentPassword, 'current password', 200);
  const newPassword = text(input?.newPassword, 'new password', 200);
  if (newPassword.length < 6) throw new Error('Password must be at least 6 characters');
  return changeCustomerPassword();
}

export async function claimWarrantyAction(input: Record<string, any>) {
  await requireRole('customer');
  text(input?.warrantyId, 'warranty id');
  text(input?.issueDescription || input?.description, 'claim description', 2000);
  return submitCustomerWarrantyClaim();
}