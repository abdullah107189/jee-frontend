import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import CategoriesContent from './components/CategoriesContent';

export const metadata: Metadata = {
  title: 'Categories | TechStore Admin',
  description: 'Manage product categories.',
};

export default function AdminCategoriesPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <CategoriesContent />
    </DashboardLayout>
  );
}