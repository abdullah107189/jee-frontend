import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import BrandsContent from './components/BrandsContent';

export const metadata: Metadata = {
  title: 'Brands | TechStore Admin',
  description: 'Manage product brands.',
};

export default function AdminBrandsPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <BrandsContent />
    </DashboardLayout>
  );
}