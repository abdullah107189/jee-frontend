import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import WarrantyClaimsContent from '@/components/modules/admin/warranties/claims/WarrantyClaimsContent';
import { getAdminWarrantyClaims } from '@/services/warranty.service';

export const metadata: Metadata = {
  title: 'Warranty Claims | JEE Admin',
  description: 'Review and resolve customer warranty claims.',
};

export default async function AdminWarrantyClaimsPage() {
  const claims = await getAdminWarrantyClaims();

  return (
    <DashboardLayout allowedRole="admin">
      <WarrantyClaimsContent claims={claims} />
    </DashboardLayout>
  );
}