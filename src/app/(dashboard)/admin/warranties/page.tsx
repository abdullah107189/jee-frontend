import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AdminWarrantiesContent from './components/AdminWarrantiesContent';

export const metadata: Metadata = {
  title: 'Warranties | TechStore Admin',
  description: 'View all customer warranties across the platform.',
};

export default function AdminWarrantiesPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <AdminWarrantiesContent />
    </DashboardLayout>
  );
}