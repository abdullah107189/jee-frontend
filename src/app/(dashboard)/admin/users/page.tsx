import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import UsersContent from '@/components/modules/admin/users/UsersContent';
import { getUsers } from '@/services/admin.service';

export const metadata: Metadata = {
  title: 'Users | JEE Admin',
  description: 'Manage platform users and their roles.',
};

export default async function AdminUsersPage() {
  const users = await getUsers();

  return ( 
      <UsersContent users={users} /> 
  );
}