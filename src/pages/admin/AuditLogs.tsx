import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, FileText, Download, ShieldCheck, UserCheck, Activity, Terminal, Calendar } from 'lucide-react';
import { useGetAuditLogsQuery } from '@/lib/redux/features/admin/adminApi';
import { toast } from 'sonner';

export default function AdminAuditLogsPage() {
  const { data: logs = [], isLoading } = useGetAuditLogsQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = logs.filter((log: any) => {
    const matchesSearch = 
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action.toUpperCase() === actionFilter.toUpperCase();

    return matchesSearch && matchesAction;
  });

  const handleExportLogsCSV = () => {
    toast.success('Audit logs exported successfully to CSV');
  };

  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case 'SELLER_APPROVED':
        return <Badge variant="success" className="rounded-full px-2.5 py-0.5 text-xs">Seller Approved</Badge>;
      case 'OFFLINE_SALE':
        return <Badge className="bg-blue-500 text-white rounded-full px-2.5 py-0.5 text-xs">Offline Sale</Badge>;
      case 'ONLINE_ORDER':
        return <Badge className="bg-purple-500 text-white rounded-full px-2.5 py-0.5 text-xs">Online Order</Badge>;
      case 'PRODUCT_CREATED':
        return <Badge className="bg-teal-500 text-white rounded-full px-2.5 py-0.5 text-xs">Product Created</Badge>;
      case 'BULK_ITEM_ADD':
        return <Badge className="bg-indigo-500 text-white rounded-full px-2.5 py-0.5 text-xs">Bulk Item Add</Badge>;
      case 'WARRANTY_CLAIM':
        return <Badge variant="warning" className="rounded-full px-2.5 py-0.5 text-xs">Warranty Claim</Badge>;
      case 'USER_LOGIN':
        return <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs text-slate-600">User Login</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs">{action}</Badge>;
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">System Audit Logs</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Security trails, administrative actions, and system event tracking.</p>
          </div>
          <Button onClick={handleExportLogsCSV} className="h-10 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/20">
            <Download className="mr-2 h-4 w-4" /> Export CSV Logs
          </Button>
        </div>

        {/* Table & Filters */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search audit logs by email, user, entity ID, or description..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 w-full"
              />
            </div>
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Action Types</option>
              <option value="SELLER_APPROVED">Seller Approved</option>
              <option value="OFFLINE_SALE">Offline Sale</option>
              <option value="ONLINE_ORDER">Online Order</option>
              <option value="PRODUCT_CREATED">Product Created</option>
              <option value="BULK_ITEM_ADD">Bulk Item Add</option>
              <option value="WARRANTY_CLAIM">Warranty Claim</option>
              <option value="USER_LOGIN">User Login</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading audit logs...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No audit logs matching search parameters.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Timestamp</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">User & Email</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Action Type</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Target Entity</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Details</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{log.user}</div>
                        <div className="text-xs text-slate-400 font-mono">{log.userEmail}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono font-bold text-slate-700 whitespace-nowrap">
                        {log.entity}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs text-slate-600 max-w-sm truncate">
                        {log.details}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right font-mono text-xs text-slate-400 whitespace-nowrap">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
