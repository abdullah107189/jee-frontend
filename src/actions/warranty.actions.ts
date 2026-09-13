'use server';

import { checkWarranty } from '@/services/warranty.service';

export async function checkWarrantyAction(uniqueId: string) {
  const normalizedId = uniqueId.trim().toUpperCase();
  if (normalizedId.length < 3 || !/^[A-Z0-9-]+$/.test(normalizedId)) throw new Error('Invalid warranty ID');
  return checkWarranty(normalizedId);
}