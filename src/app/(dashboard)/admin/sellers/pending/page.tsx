import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import PendingSellersContent from './components/PendingSellersContent';

export const metadata: Metadata = {
  title: 'Pending Sellers | TechStore Admin',
  description: 'Review and approve pending seller applications.',
};

export default function AdminPendingSellersPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <PendingSellersContent />
    </DashboardLayout>
  );
}