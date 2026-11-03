"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, ShieldCheck, ShieldAlert, Award, Clock, Eye, AlertTriangle, CheckCircle, Ban, Wrench } from 'lucide-react';
import { updateWarrantyStatusAction } from '@/actions/admin.actions';
import type { AdminWarranty } from '@/services/admin.service';
import { toast } from 'sonner'; 
import Link from 'next/link';

const formatDateDayFirst = (dateVal?: string | Date | null) => {
  if (!dateVal) return '-';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
  } catch {
    return String(dateVal);
  }
};

export default function AdminWarrantiesPage({ warranties }: { warranties: AdminWarranty[] }) {
  const [warrantiesList, setWarrantiesList] = useState<AdminWarranty[]>(warranties);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedWarranty, setSelectedWarranty] = useState<any | null>(null);

  useEffect(() => {
    setWarrantiesList(warranties);
  }, [warranties]);

  const filteredWarranties = warrantiesList.filter((w: any) => {
    const matchesSearch = 
      (w.uniqueId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.productName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.customerPhone || "").includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || (w.status || "").toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateWarrantyStatusAction({ id, status: newStatus });
      toast.success(`Warranty status updated to ${newStatus}`);
      setWarrantiesList((prev) => prev.map((w: any) => w.id === id ? { ...w, status: newStatus } : w));
      if (selectedWarranty) {
        setSelectedWarranty((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update warranty status');
    }
  };

  const getWarrantyBadge = (status: string) => {
    switch ((status || "").toUpperCase()) {
      case 'ACTIVE':
        return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">Active</Badge>;
      case 'CLAIMED':
        return <Badge className="bg-amber-500 text-white rounded-full px-3 py-1 text-xs">Claimed</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs text-muted-foreground border-border">Expired</Badge>;
      case 'VOID':
        return <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">Void</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{status}</Badge>;
    }
  };

  return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Warranty Registry</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">Verify registered digital warranties, customer claims, and physical unit statuses.</p>
          </div>
          <Link href="/admin/warranties/claims">
            <Button className="h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">
              <Wrench className="mr-2 h-5 w-5" /> Claims & Servicing Desk
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Active Warranties</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{warrantiesList.filter((w: any) => (w.status || "").toUpperCase() === 'ACTIVE').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Award className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Claimed</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{warrantiesList.filter((w: any) => (w.status || "").toUpperCase() === 'CLAIMED').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-muted text-muted-foreground rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Expired</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{warrantiesList.filter((w: any) => (w.status || "").toUpperCase() === 'EXPIRED').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Void / Revoked</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{warrantiesList.filter((w: any) => (w.status || "").toUpperCase() === 'VOID').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Warranties Table Card */}
        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-border/60 bg-card flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by Unique ID, Product Name, Customer or Phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-12 rounded-xl bg-muted/40 border-border focus:bg-background focus:border-blue-500 focus:ring-blue-500/20 w-full"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 sm:h-12 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Warranty Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="CLAIMED">Claimed</option>
              <option value="EXPIRED">Expired</option>
              <option value="VOID">Void</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {filteredWarranties.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground font-medium">No warranty records found.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border/60">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Unique ID</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Product Name</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Customer</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Seller & Type</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Validity Period</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Status</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredWarranties.map((w: any) => (
                    <tr key={w.id} className="hover:bg-muted/30 transition-colors bg-card">
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {w.uniqueId}
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-semibold text-foreground">
                        {w.productName}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-foreground">
                        <div>{w.customerName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{w.customerPhone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs text-muted-foreground">
                        <div className="font-semibold text-foreground">{w.sellerName}</div>
                        <Badge variant="outline" className="mt-0.5 text-[10px] py-0 border-border">{w.saleType}</Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-muted-foreground">
                        <div>{formatDateDayFirst(w.startDate)}</div>
                        <div className="text-muted-foreground/80">to {formatDateDayFirst(w.endDate)}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getWarrantyBadge(w.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedWarranty(w)}
                          className="h-9 px-3 rounded-xl text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-semibold"
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-card text-card-foreground rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
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
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Customer Information</span>
                    <p className="font-bold text-foreground mt-1">{selectedWarranty.customerName}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{selectedWarranty.customerPhone}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Sales Point & Channel</span>
                    <p className="font-bold text-foreground mt-1">{selectedWarranty.sellerName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Channel: {selectedWarranty.saleType} Order</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-blue-900 dark:text-blue-300">Warranty Coverage Term</span>
                    <span className="text-xs font-mono text-blue-700 dark:text-blue-300 font-semibold">{formatDateDayFirst(selectedWarranty.startDate)} → {formatDateDayFirst(selectedWarranty.endDate)}</span>
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    Covers manufacturing defects and internal motor failure. Customer can submit warranty claims at any authorized merchant.
                  </p>
                </div>

                {/* Status Update Buttons */}
                <div className="pt-4 border-t border-border/60 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground">Quick Status Update</h4>
                    <Link href={`/admin/warranties/claims`}>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center">
                        <Wrench className="h-3.5 w-3.5 mr-1" /> Go to Claims & Servicing Desk →
                      </span>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(selectedWarranty.status || "").toUpperCase() !== 'CLAIMED' && (
                      <Button 
                        onClick={() => handleStatusChange(selectedWarranty.id, 'Claimed')}
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                      >
                        <Award className="h-4 w-4 mr-2" /> Mark as Claimed
                      </Button>
                    )}
                    {(selectedWarranty.status || "").toUpperCase() !== 'ACTIVE' && (
                      <Button 
                        onClick={() => handleStatusChange(selectedWarranty.id, 'Active')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Set Active
                      </Button>
                    )}
                    {(selectedWarranty.status || "").toUpperCase() !== 'VOID' && (
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

              <div className="p-4 bg-muted/40 border-t border-border/60 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedWarranty(null)} className="rounded-xl border-border">Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
