import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import PendingSellersContent from '@/components/admin/sellers/pending/PendingSellersContent';
import { getPendingSellers } from '@/services/admin.service';

export const metadata: Metadata = {
  title: 'Pending Sellers | TechStore Admin',
  description: 'Review and approve pending seller applications.',
};

export default async function AdminPendingSellersPage() {
  const pendingSellers = await getPendingSellers();

  return (
    <DashboardLayout allowedRole="admin">
      <PendingSellersContent pendingSellers={pendingSellers} />
    </DashboardLayout>
  );
}