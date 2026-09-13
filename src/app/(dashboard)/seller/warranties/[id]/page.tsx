import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SellerWarrantyDetailsContent from '@/components/modules/seller/details/SellerWarrantyDetailsContentt
import { getSellerWarrantyDetails } from '@/services/seller.service';

export const metadata: Metadata = {
  title: 'Warranty Details | JEE',
  description: 'Digital guarantee record with customer and claim history information.',
};

export default async function SellerWarrantyDetailsPage({ params }: { params: { id: string } }) {
  const warranty = await getSellerWarrantyDetails(params.id);

  return (
    <DashboardLayout allowedRole="seller">
      <SellerWarrantyDetailsContent warranty={warranty} />
    </DashboardLayout>
  );
}