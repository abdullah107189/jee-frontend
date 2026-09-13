import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AuditLogsContent from '@/components/admin/audit-logs/AuditLogsContent';
import { getAuditLogs } from '@/services/admin.service';

export const metadata: Metadata = {
  title: 'Audit Logs | TechStore Admin',
  description: 'System audit logs and activity history.',
};

export default async function AdminAuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <DashboardLayout allowedRole="admin">
      <AuditLogsContent logs={logs} />
    </DashboardLayout>
  );
}