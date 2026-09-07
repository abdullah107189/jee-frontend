import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import ProfileContent from './components/ProfileContent';

export const metadata: Metadata = {
  title: 'Seller Profile | TechStore',
  description: 'Manage merchant outlet profile details and account security.',
};

export default function SellerProfilePage() {
  return (
    <DashboardLayout allowedRole="seller">
      <ProfileContent />
    </DashboardLayout>
  );
}