import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import WarrantyClaimsContent from './components/WarrantyClaimsContent';

export const metadata: Metadata = {
  title: 'Warranty Claims | TechStore Admin',
  description: 'Review and resolve customer warranty claims.',
};

export default function AdminWarrantyClaimsPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <WarrantyClaimsContent />
    </DashboardLayout>
  );
}