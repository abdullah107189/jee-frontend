import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AllProductItemsContent from '@/components/admin/items/AllProductItemsContent';
import { getAdminProductItems } from '@/services/admin.service';

export const metadata: Metadata = {
  title: 'All Product Items | JEE Admin',
  description: 'Global view of all physical units across products.',
};

export default async function AdminAllProductItemsPage() {
  const items = await getAdminProductItems();

  return (
    <DashboardLayout allowedRole="admin">
      <AllProductItemsContent items={items} />
    </DashboardLayout>
  );
}