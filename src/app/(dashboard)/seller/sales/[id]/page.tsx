import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SaleDetailsContent from './components/SaleDetailsContent';

export const metadata: Metadata = {
  title: 'Sale Details | TechStore',
  description: 'View transaction details, customer information and warranty summary.',
};

export default function SaleDetailsPage() {
  return (
    <DashboardLayout allowedRole="seller">
      <SaleDetailsContent />
    </DashboardLayout>
  );
}