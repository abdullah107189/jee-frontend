import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BrandsContent from '@/components/admin/brands/BrandsContent';
import { getAdminBrands } from '@/services/admin.service';

export const metadata: Metadata = {
  title: 'Brands | JEE Admin',
  description: 'Manage product brands.',
};

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <DashboardLayout allowedRole="admin">
      <BrandsContent brands={brands} />
    </DashboardLayout>
  );
}