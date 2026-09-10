import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SellerWarrantiesContent from './components/SellerWarrantiesContent';

export const metadata: Metadata = {
  title: 'Warranty Registry | TechStore',
  description: 'Track customer digital warranties, activation dates and claim status.',
};

export default function SellerWarrantiesPage() {
  return (
    <DashboardLayout allowedRole="seller">
      <SellerWarrantiesContent />
    </DashboardLayout>
  );
}