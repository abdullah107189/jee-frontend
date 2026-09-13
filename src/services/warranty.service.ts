export {
  getAdminWarrantyClaims,
  getAdminWarranties,
} from './admin.service';

export type { AdminWarranty, AdminWarrantyClaim } from './admin.service';

export async function checkWarranty(uniqueId: string) {
  if (uniqueId === 'EXPIRED') {
    return { status: 'EXPIRED', productName: 'Old Fan', startDate: '2020-01-01', endDate: '2021-01-01', daysRemaining: 0 };
  }

  return {
    uniqueId,
    status: 'ACTIVE',
    productName: 'Vision 56" Ceiling Fan',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: 365,
    sellerInfo: 'Offline Store #1',
  };
}