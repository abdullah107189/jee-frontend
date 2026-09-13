import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AdminWarrantiesContent from '@/components/modules/admin/warranties/AdminWarrantiesContent';
import { getAdminWarranties } from '@/services/warranty.service';

export const metadata: Metadata = {
  title: 'Warranties | JEE Admin',
  description: 'View all customer warranties across the platform.',
};

export default async function AdminWarrantiesPage() {
  const warranties = await getAdminWarranties();

  return (
    <DashboardLayout allowedRole="admin">
      <AdminWarrantiesContent warranties={warranties} />
    </DashboardLayout>
  );
}