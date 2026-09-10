import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SellerWarrantyDetailsContent from './components/SellerWarrantyDetailsContent';

export const metadata: Metadata = {
  title: 'Warranty Details | TechStore',
  description: 'Digital guarantee record with customer and claim history information.',
};

export default function SellerWarrantyDetailsPage() {
  return (
    <DashboardLayout allowedRole="seller">
      <SellerWarrantyDetailsContent />
    </DashboardLayout>
  );
}