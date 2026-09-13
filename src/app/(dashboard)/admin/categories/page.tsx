import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import CategoriesContent from '@/components/admin/categories/CategoriesContent';
import { getAdminCategories } from '@/services/admin.service';

export const metadata: Metadata = {
  title: 'Categories | TechStore Admin',
  description: 'Manage product categories.',
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <DashboardLayout allowedRole="admin">
      <CategoriesContent categories={categories} />
    </DashboardLayout>
  );
}