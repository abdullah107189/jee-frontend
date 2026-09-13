import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProductsListContent from '@/components/modules/admin/products/ProductsListContent';
import { getAdminProducts } from '@/services/admin.service';

export const metadata: Metadata = {
  title: 'Products | JEE Admin',
  description: 'Manage product catalog entries.',
};

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <DashboardLayout allowedRole="admin">
      <ProductsListContent products={products} />
    </DashboardLayout>
  );
}