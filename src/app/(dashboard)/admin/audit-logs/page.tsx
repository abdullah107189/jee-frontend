import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AuditLogsContent from './components/AuditLogsContent';

export const metadata: Metadata = {
  title: 'Audit Logs | TechStore Admin',
  description: 'System audit logs and activity history.',
};

export default function AdminAuditLogsPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <AuditLogsContent />
    </DashboardLayout>
  );
}