import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, ShieldCheck, ShieldAlert, Award, Clock, Eye, AlertTriangle, CheckCircle, Ban, ArrowRight } from 'lucide-react';
import { useGetWarrantiesQuery, useUpdateWarrantyStatusMutation } from '@/lib/redux/features/admin/adminApi';
import { toast } from 'sonner'; 
import Link from 'next/link';

export default function AdminWarrantiesPage() {
  const { data: warranties = [], isLoading } = useGetWarrantiesQuery();
  const [updateWarrantyStatus] = useUpdateWarrantyStatusMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedWarranty, setSelectedWarranty] = useState<any | null>(null);

  const filteredWarranties = warranties.filter((w: any) => {
    const matchesSearch = 
      w.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || w.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateWarrantyStatus({ id, status: newStatus }).unwrap();
      toast.success(`Warranty status updated to ${newStatus}`);
      if (selectedWarranty) {
        setSelectedWarranty((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      toast.error('Failed to update warranty status');
    }
  };

  const getWarrantyBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">Active</Badge>;
      case 'CLAIMED':
        return <Badge className="bg-amber-500 text-white rounded-full px-3 py-1 text-xs">Claimed</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs text-slate-500">Expired</Badge>;
      case 'VOID':
        return <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">Void</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Warranty Registry</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Verify registered digital warranties, customer claims, and physical unit statuses.</p>
          </div>
          <Link href="/admin/warranties/claims">
            <Button className="h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">
              <ShieldAlert className="mr-2 h-5 w-5" /> View Warranty Claims
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Active Warranties</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{warranties.filter((w: any) => w.status === 'Active').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Award className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Claimed</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{warranties.filter((w: any) => w.status === 'Claimed').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Expired</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{warranties.filter((w: any) => w.status === 'Expired').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Void / Revoked</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{warranties.filter((w: any) => w.status === 'Void').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Warranties Table Card */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by Unique ID, Product Name, Customer or Phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 w-full"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Warranty Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="CLAIMED">Claimed</option>
              <option value="EXPIRED">Expired</option>
              <option value="VOID">Void</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading warranty records...</div>
            ) : filteredWarranties.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No warranty records found.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Unique ID</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Product Name</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Customer</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Seller & Type</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Validity Period</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Status</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredWarranties.map((w: any) => (
                    <tr key={w.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-blue-600">
                        {w.uniqueId}
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-semibold text-slate-800">
                        {w.productName}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-700">
                        <div>{w.customerName}</div>
                        <div className="text-xs text-slate-400 font-mono">{w.customerPhone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs text-slate-600">
                        <div className="font-semibold text-slate-800">{w.sellerName}</div>
                        <Badge variant="outline" className="mt-0.5 text-[10px] py-0">{w.saleType}</Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-slate-500">
                        <div>{w.startDate}</div>
                        <div className="text-slate-400">to {w.endDate}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getWarrantyBadge(w.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedWarranty(w)}
                          className="h-9 px-3 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                        >
                          <Eye className="h-4 w-4 mr-1.5" /> Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Warranty Detail Modal */}
        {selectedWarranty && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold font-mono text-blue-400">{selectedWarranty.uniqueId}</h3>
                    {getWarrantyBadge(selectedWarranty.status)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{selectedWarranty.productName}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedWarranty(null)} className="text-slate-400 hover:text-white">✕</Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Customer Information</span>
                    <p className="font-bold text-slate-800 mt-1">{selectedWarranty.customerName}</p>
                    <p className="text-xs font-mono text-slate-600 mt-0.5">{selectedWarranty.customerPhone}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Sales Point & Channel</span>
                    <p className="font-bold text-slate-800 mt-1">{selectedWarranty.sellerName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Channel: {selectedWarranty.saleType} Order</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-blue-900">Warranty Coverage Term</span>
                    <span className="text-xs font-mono text-blue-700 font-semibold">{selectedWarranty.startDate} → {selectedWarranty.endDate}</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    Covers manufacturing defects and internal motor failure. Customer can submit warranty claims at any authorized merchant.
                  </p>
                </div>

                {/* Status Update Buttons */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Quick Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedWarranty.status !== 'Claimed' && (
                      <Button 
                        onClick={() => handleStatusChange(selectedWarranty.id, 'Claimed')}
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                      >
                        <Award className="h-4 w-4 mr-2" /> Mark as Claimed
                      </Button>
                    )}
                    {selectedWarranty.status !== 'Active' && (
                      <Button 
                        onClick={() => handleStatusChange(selectedWarranty.id, 'Active')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Set Active
                      </Button>
                    )}
                    {selectedWarranty.status !== 'Void' && (
                      <Button 
                        onClick={() => handleStatusChange(selectedWarranty.id, 'Void')}
                        variant="destructive"
                        className="rounded-xl"
                      >
                        <Ban className="h-4 w-4 mr-2" /> Void Warranty
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedWarranty(null)} className="rounded-xl">Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
