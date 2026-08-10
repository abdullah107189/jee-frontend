import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, ShieldCheck, Eye, Clock, Award, AlertTriangle } from 'lucide-react';
import { useGetSellerWarrantiesQuery } from '@/lib/redux/features/seller/sellerApi';
import Link from 'next/link';
export default function SellerWarrantiesPage() {
  const { data: warranties = [], isLoading } = useGetSellerWarrantiesQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredWarranties = warranties.filter((w: any) => {
    const matchesSearch = 
      w.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || w.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">✅ Active</Badge>;
      case 'CLAIMED':
        return <Badge className="bg-amber-500 text-white rounded-full px-3 py-1 text-xs">Claimed</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs text-slate-500">Expired</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Warranty Registry</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Track customer digital warranties, activation dates, and claim status.</p>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by Unique ID, Product Name, or Customer Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 w-full text-sm"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="CLAIMED">Claimed</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading warranty database...</div>
            ) : filteredWarranties.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No warranty records found.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-4">Unique ID</th>
                    <th className="px-5 py-4">Product Name</th>
                    <th className="px-5 py-4">Customer Name</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Start Date</th>
                    <th className="px-5 py-4">End Date</th>
                    <th className="px-5 py-4">Days Left</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredWarranties.map((w: any) => (
                    <tr key={w.id} className="hover:bg-slate-50/60 transition-colors bg-white">
                      <td className="px-5 py-4 font-mono font-bold text-blue-600">{w.uniqueId}</td>
                      <td className="px-5 py-4 font-semibold text-slate-900">{w.productName}</td>
                      <td className="px-5 py-4 text-slate-800 font-medium">
                        <div>{w.customerName}</div>
                        <div className="text-xs text-slate-400 font-mono">{w.customerPhone}</div>
                      </td>
                      <td className="px-5 py-4">{getStatusBadge(w.status)}</td>
                      <td className="px-5 py-4 text-xs font-mono text-slate-500">{w.startDate}</td>
                      <td className="px-5 py-4 text-xs font-mono text-slate-500">{w.endDate}</td>
                      <td className="px-5 py-4 font-extrabold text-blue-700">{w.daysRemaining} days</td>
                      <td className="px-5 py-4 text-right">
                        <Link href={`/seller/warranties/${w.id}`}>
                          <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold">
                            <Eye className="h-4 w-4 mr-1.5" /> View Details
                          </Button>
                        </Link>
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
