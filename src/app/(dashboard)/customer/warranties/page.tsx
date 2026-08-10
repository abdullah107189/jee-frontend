
import { Metadata } from 'next';
import { WarrantyListClient } from './components/WarrantyListClient';

export const metadata: Metadata = {
  title: 'My Warranties | TechStore',
  description: 'View all your product warranties, check status, and manage claims',
  keywords: 'warranty, product warranty, claim warranty, techstore',
};

// This is a Server Component - SEO data is pre-rendered
export default async function WarrantiesPage() {
  // Server-side data fetching (if needed)
  // const warranties = await fetchWarranties();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Warranties</h1>
      {/* Client component for interactivity */}
      <WarrantyListClient />
    </div>
  );
}