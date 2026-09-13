import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SellerWarrantiesContent from '@/components/seller/warranties/SellerWarrantiesContent';
import { getSellerWarranties } from '@/services/seller.service';

export const metadata: Metadata = {
  title: 'Warranty Registry | TechStore',
  description: 'Track customer digital warranties, activation dates and claim status.',
};

export default async function SellerWarrantiesPage() {
  const warranties = await getSellerWarranties();

  return (
    <DashboardLayout allowedRole="seller">
      <SellerWarrantiesContent warranties={warranties} />
    </DashboardLayout>
  );
}