
import { Metadata } from 'next';
import { WarrantyListClient } from '@/components/modules/customer/warranties/WarrantyListClient';
import { getCustomerWarranties } from '@/services/customer.service';

export const metadata: Metadata = {
  title: 'My Warranties | JEE',
  description: 'View all your product warranties, check status, and manage claims',
  keywords: 'warranty, product warranty, claim warranty, JEE',
};

// This is a Server Component - SEO data is pre-rendered
export default async function WarrantiesPage() {
  const warranties = await getCustomerWarranties();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Warranties</h1>
      {/* Client component for interactivity */}
      <WarrantyListClient warranties={warranties} />
    </div>
  );
}