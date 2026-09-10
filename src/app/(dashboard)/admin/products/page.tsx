import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProductsListContent from './components/ProductsListContent';

export const metadata: Metadata = {
  title: 'Products | TechStore Admin',
  description: 'Manage product catalog entries.',
};

export default function AdminProductsPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <ProductsListContent />
    </DashboardLayout>
  );
}