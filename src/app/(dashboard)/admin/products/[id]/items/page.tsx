import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProductItemsContent from '@/components/admin/products/items/ProductItemsContent';

export const metadata: Metadata = {
  title: 'Product Items | JEE Admin',
  description: 'Bulk add physical unit items with unique IDs for a product.',
};

export default function AdminProductItemsPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <ProductItemsContent />
    </DashboardLayout>
  );
}