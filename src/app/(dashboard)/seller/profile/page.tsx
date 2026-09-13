import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProfileContent from '@/components/seller/profile/ProfileContent';
import { getSellerProfile } from '@/services/seller.service';

export const metadata: Metadata = {
  title: 'Seller Profile | TechStore',
  description: 'Manage merchant outlet profile details and account security.',
};

export default async function SellerProfilePage() {
  const profile = await getSellerProfile();

  return (
    <DashboardLayout allowedRole="seller">
      <ProfileContent profile={profile} />
    </DashboardLayout>
  );
}