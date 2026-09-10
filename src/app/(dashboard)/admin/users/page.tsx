import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import UsersContent from './components/UsersContent';

export const metadata: Metadata = {
  title: 'Users | TechStore Admin',
  description: 'Manage platform users and their roles.',
};

export default function AdminUsersPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <UsersContent />
    </DashboardLayout>
  );
}