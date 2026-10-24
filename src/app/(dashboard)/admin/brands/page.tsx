import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BrandsContent from '@/components/modules/admin/brands/BrandsContent';
import { brandServices } from '@/services/brand.service';

export const metadata: Metadata = {
  title: 'Brands | JEE Admin',
  description: 'Manage product brands.',
};

export default async function AdminBrandsPage() {
  const brands = await brandServices.getBrands();

  return (
    <BrandsContent brands={brands} />
  );
}