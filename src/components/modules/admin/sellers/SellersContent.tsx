"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Users, ShieldAlert, CheckCircle, Clock, Eye, Ban, UserCheck, ShieldOff, FileText, ShoppingBag, Award } from 'lucide-react';
import { updateSellerStatusAction } from '@/actions/admin.actions';
import type { AdminSeller } from '@/services/admin.service';
import { toast } from 'sonner';

export default function AdminSellersPage({ sellers }: { sellers: AdminSeller[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSeller, setSelectedSeller] = useState<AdminSeller | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'sales' | 'warranties'>('profile');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredSellers = sellers.filter((seller) => {
    const company = (seller.companyName || '').toLowerCase();
    const owner = (seller.ownerName || '').toLowerCase();
    const email = (seller.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch = 
      company.includes(term) ||
      owner.includes(term) ||
      email.includes(term);
    
    const sellerStatus = (seller.status || '').toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || sellerStatus === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (sellerId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateSellerStatusAction({ id: sellerId, status: newStatus });
      toast.success(`Seller status updated to ${newStatus}`);
      if (selectedSeller && selectedSeller.id === sellerId) {
        setSelectedSeller({ ...selectedSeller, status: newStatus });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update seller status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch ((status || '').toUpperCase()) {
      case 'APPROVED':
        return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">Approved</Badge>;
      case 'PENDING':
        return <Badge variant="warning" className="rounded-full px-3 py-1 text-xs">Pending</Badge>;
      case 'SUSPENDED':
        return <Badge variant="warning" className="rounded-full px-3 py-1 text-xs">Suspended</Badge>;
      case 'DISABLED':
        return <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">Disabled</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{status || 'Unknown'}</Badge>;
    }
  };

  const approvedCount = sellers.filter((s) => (s.status || '').toUpperCase() === 'APPROVED').length;
  const pendingCount = sellers.filter((s) => (s.status || '').toUpperCase() === 'PENDING').length;
  const suspendedCount = sellers.filter((s) => {
    const st = (s.status || '').toUpperCase();
    return st === 'SUSPENDED' || st === 'DISABLED';
  }).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="page-header-title">Sellers Management</h1>
          <p className="page-header-desc">Manage merchant accounts, approvals, and sales histories.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
                <Users className="h-5 w-5" />
              </div>
              <span className="typo-badge text-muted-foreground">Total Sellers</span>
            </div>
            <p className="typo-h2 font-extrabold text-foreground">{sellers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="typo-badge text-muted-foreground">Approved</span>
            </div>
            <p className="typo-h2 font-extrabold text-foreground">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <span className="typo-badge text-muted-foreground">Pending</span>
            </div>
            <p className="typo-h2 font-extrabold text-foreground">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <span className="typo-badge text-muted-foreground">Suspended</span>
            </div>
            <p className="typo-h2 font-extrabold text-foreground">{suspendedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table & Filters */}
      <Card className="rounded-2xl sm:rounded-[2rem] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border bg-card flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search sellers by company name, owner, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 sm:h-12 rounded-xl w-full"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 sm:h-12 rounded-xl border border-input bg-background dark:bg-muted/40 px-4 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {filteredSellers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-medium">No sellers found matching criteria.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Company Name</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Owner</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Contact</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Joined Date</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-muted/30 transition-colors bg-card">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-foreground">{seller.companyName}</div>
                      <div className="text-xs text-muted-foreground font-mono">Lic: {seller.licenseNo}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-foreground/80 font-medium">
                      {seller.ownerName}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-foreground/80">
                      <div>{seller.email}</div>
                      <div className="text-xs text-muted-foreground font-mono">{seller.phone}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-muted-foreground text-xs font-mono">
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
                        className="h-9 px-3 rounded-xl text-primary hover:bg-primary/10 font-semibold"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card text-card-foreground rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{selectedSeller.companyName}</h3>
                <p className="text-xs text-slate-400 mt-1">Merchant Profile & System Authorization</p>
              </div>
              <div>
                {getStatusBadge(selectedSeller.status)}
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-border bg-muted/30 px-6 pt-3 gap-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                <FileText className="inline-block h-4 w-4 mr-2 -mt-0.5" /> Seller Profile
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'sales' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                <ShoppingBag className="inline-block h-4 w-4 mr-2 -mt-0.5" /> Sales History ({selectedSeller.salesCount})
              </button>
              <button
                onClick={() => setActiveTab('warranties')}
                className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'warranties' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                <Award className="inline-block h-4 w-4 mr-2 -mt-0.5" /> Warranty Records ({selectedSeller.warrantyCount})
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Email Address</span>
                      <p className="text-foreground font-semibold mt-1">{selectedSeller.email}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Phone Number</span>
                      <p className="text-foreground font-semibold mt-1">{selectedSeller.phone}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">License Number</span>
                      <p className="text-foreground font-semibold font-mono mt-1">{selectedSeller.licenseNo}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Joined Date</span>
                      <p className="text-foreground font-semibold mt-1">{selectedSeller.joinedDate}</p>
                    </div>
                    {selectedSeller.address && (
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border md:col-span-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Address</span>
                        <p className="text-foreground font-medium mt-1">
                          {[selectedSeller.address, selectedSeller.city, selectedSeller.state, selectedSeller.zipCode, selectedSeller.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-bold text-foreground mb-3">Seller Status Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      {(selectedSeller.status || '').toUpperCase() !== 'APPROVED' && (
                        <Button 
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(selectedSeller.id, 'APPROVED')} 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                        >
                          <UserCheck className="h-4 w-4 mr-2" /> Approve Seller
                        </Button>
                      )}
                      {(selectedSeller.status || '').toUpperCase() !== 'SUSPENDED' && (
                        <Button 
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(selectedSeller.id, 'SUSPENDED')} 
                          className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
                        >
                          <ShieldOff className="h-4 w-4 mr-2" /> Suspend Account
                        </Button>
                      )}
                      {(selectedSeller.status || '').toUpperCase() !== 'DISABLED' && (
                        <Button 
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(selectedSeller.id, 'DISABLED')} 
                          variant="destructive" 
                          className="rounded-xl font-bold"
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
                  <p className="text-xs text-muted-foreground">Total offline sales registered: {selectedSeller.salesCount}</p>
                  {selectedSeller.salesCount === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-muted/30 border border-border rounded-2xl text-xs font-medium">
                      No sales registered yet by this merchant.
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-foreground bg-muted/30 border border-border rounded-xl">
                      Sales history is managed via POS terminal.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'warranties' && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">Active product warranties registered: {selectedSeller.warrantyCount}</p>
                  {selectedSeller.warrantyCount === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-muted/30 border border-border rounded-2xl text-xs font-medium">
                      No warranty records linked to this merchant.
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-foreground bg-muted/30 border border-border rounded-xl">
                      Warranty registry is updated upon POS/Order delivery.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-muted/30 border-t border-border flex justify-end">
              <Button variant="outline" onClick={() => setSelectedSeller(null)} className="rounded-xl font-bold">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
