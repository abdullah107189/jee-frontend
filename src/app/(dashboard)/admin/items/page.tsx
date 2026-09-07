import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AllProductItemsContent from './components/AllProductItemsContent';

export const metadata: Metadata = {
  title: 'All Product Items | TechStore Admin',
  description: 'Global view of all physical units across products.',
};

export default function AdminAllProductItemsPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <AllProductItemsContent />
    </DashboardLayout>
  );
}