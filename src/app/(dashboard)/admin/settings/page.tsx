import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SettingsContent from '@/components/admin/settings/SettingsContent';

export const metadata: Metadata = {
  title: 'Settings | TechStore Admin',
  description: 'Platform configuration and settings.',
};

export default function AdminSettingsPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <SettingsContent />
    </DashboardLayout>
  );
}