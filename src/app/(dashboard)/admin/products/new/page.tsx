import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProductAddContent from '@/components/admin/products/new/ProductAddContent';

export const metadata: Metadata = {
  title: 'Add Product | JEE Admin',
  description: 'Create a new product in the catalog.',
};

export default function AdminProductAddPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <ProductAddContent />
    </DashboardLayout>
  );
}