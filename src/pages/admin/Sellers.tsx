import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Users, ShieldAlert, CheckCircle, Clock, Eye, Ban, UserCheck, ShieldOff, FileText, ShoppingBag, Award } from 'lucide-react';
import { useGetSellersQuery, useUpdateSellerStatusMutation } from '@/lib/redux/features/admin/adminApi';
import { toast } from 'sonner';

export default function AdminSellersPage() {
  const { data: sellers = [], isLoading } = useGetSellersQuery();
  const [updateStatus] = useUpdateSellerStatusMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'sales' | 'warranties'>('profile');

  const filteredSellers = sellers.filter((seller: any) => {
    const matchesSearch = 
      seller.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || seller.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (sellerId: string, newStatus: string) => {
    try {
      await updateStatus({ id: sellerId, status: newStatus }).unwrap();
      toast.success(`Seller status updated to ${newStatus}`);
      if (selectedSeller) {
        setSelectedSeller((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      toast.error('Failed to update seller status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">Approved</Badge>;
      case 'PENDING':
        return <Badge variant="warning" className="rounded-full px-3 py-1 text-xs">Pending</Badge>;
      case 'SUSPENDED':
        return <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs bg-amber-500">Suspended</Badge>;
      case 'DISABLED':
        return <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">Disabled</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Sellers Management</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Manage merchant accounts, approvals, and sales histories.</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Sellers</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{sellers.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Approved</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{sellers.filter((s: any) => s.status === 'Approved').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Pending</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{sellers.filter((s: any) => s.status === 'Pending').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Suspended</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{sellers.filter((s: any) => s.status === 'Suspended' || s.status === 'Disabled').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table & Filters */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search sellers by company name, owner, or email..." 
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
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading sellers...</div>
            ) : filteredSellers.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No sellers found matching criteria.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Company Name</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Owner</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Contact</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Joined Date</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Status</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredSellers.map((seller: any) => (
                    <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-semibold text-slate-900">{seller.companyName}</div>
                        <div className="text-xs text-slate-500 font-mono">Lic: {seller.licenseNo}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-700 font-medium">
                        {seller.ownerName}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-600">
                        <div>{seller.email}</div>
                        <div className="text-xs text-slate-400 font-mono">{seller.phone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-500 text-xs font-mono">
                        {seller.joinedDate}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getStatusBadge(seller.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedSeller(seller)}
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

        {/* Seller Details Modal */}
        {selectedSeller && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{selectedSeller.companyName}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">Owner: {selectedSeller.ownerName} • Lic: {selectedSeller.licenseNo}</p>
                </div>
                <div>
                  {getStatusBadge(selectedSeller.status)}
                </div>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50 px-6 pt-3 gap-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                >
                  <FileText className="inline-block h-4 w-4 mr-2 -mt-0.5" /> Seller Profile
                </button>
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'sales' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                >
                  <ShoppingBag className="inline-block h-4 w-4 mr-2 -mt-0.5" /> Sales History ({selectedSeller.salesCount})
                </button>
                <button
                  onClick={() => setActiveTab('warranties')}
                  className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'warranties' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                >
                  <Award className="inline-block h-4 w-4 mr-2 -mt-0.5" /> Warranty Records ({selectedSeller.warrantyCount})
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Email Address</span>
                        <p className="text-slate-800 font-semibold mt-1">{selectedSeller.email}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Phone Number</span>
                        <p className="text-slate-800 font-semibold mt-1">{selectedSeller.phone}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-semibold text-slate-400 uppercase">License Number</span>
                        <p className="text-slate-800 font-semibold font-mono mt-1">{selectedSeller.licenseNo}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Joined Date</span>
                        <p className="text-slate-800 font-semibold mt-1">{selectedSeller.joinedDate}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-3">Seller Status Actions</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedSeller.status !== 'Approved' && (
                          <Button 
                            onClick={() => handleStatusChange(selectedSeller.id, 'Approved')} 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                          >
                            <UserCheck className="h-4 w-4 mr-2" /> Approve Seller
                          </Button>
                        )}
                        {selectedSeller.status !== 'Suspended' && (
                          <Button 
                            onClick={() => handleStatusChange(selectedSeller.id, 'Suspended')} 
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                          >
                            <ShieldOff className="h-4 w-4 mr-2" /> Suspend Account
                          </Button>
                        )}
                        {selectedSeller.status !== 'Disabled' && (
                          <Button 
                            onClick={() => handleStatusChange(selectedSeller.id, 'Disabled')} 
                            variant="destructive" 
                            className="rounded-xl"
                          >
                            <Ban className="h-4 w-4 mr-2" /> Disable Account
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sales' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">Offline transactions issued by this seller:</p>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                          <tr>
                            <th className="p-3">TRX ID</th>
                            <th className="p-3">Product</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-xs">TRX-001928</td>
                            <td className="p-3 font-medium">Vision 56" Ceiling Fan</td>
                            <td className="p-3 font-bold">৳3,500</td>
                            <td className="p-3 text-xs text-slate-500">2026-08-09</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-xs">TRX-001929</td>
                            <td className="p-3 font-medium">Dry Iron 1000W Heavy</td>
                            <td className="p-3 font-bold">৳1,500</td>
                            <td className="p-3 text-xs text-slate-500">2026-08-07</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'warranties' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">Activated product warranties under this merchant:</p>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                          <tr>
                            <th className="p-3">Unique ID</th>
                            <th className="p-3">Product</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-xs text-blue-600 font-bold">FAN-001928</td>
                            <td className="p-3 font-medium">Vision 56" Ceiling Fan</td>
                            <td className="p-3">John Doe</td>
                            <td className="p-3"><Badge variant="success">Active</Badge></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedSeller(null)} className="rounded-xl">Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
