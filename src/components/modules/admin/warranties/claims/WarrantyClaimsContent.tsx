"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; 
import { Badge } from '@/components/ui/Badge';
import { Search, ShieldAlert, ArrowLeft, CheckCircle, Clock, XCircle, Wrench, Eye, Send, FileText } from 'lucide-react';
import { updateWarrantyClaimStatusAction } from '@/actions/admin.actions';
import type { AdminWarrantyClaim } from '@/services/admin.service';
import { toast } from 'sonner';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

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

export default function AdminWarrantyClaimsPage({ claims }: { claims: AdminWarrantyClaim[] }) {
  const [claimsList, setClaimsList] = useState<AdminWarrantyClaim[]>(claims);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

  const [resolutionNotes, setResolutionNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setClaimsList(claims);
  }, [claims]);

  const filteredClaims = claimsList.filter((claim: any) => {
    const matchesSearch = 
      (claim.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.claimNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.uniqueId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.productName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.customerPhone || "").includes(searchTerm);

    const claimStatusKey = (claim.status || "").toUpperCase().replace(/\s+/g, '_');
    const matchesStatus = statusFilter === 'ALL' || claimStatusKey === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleOpenClaimModal = (claim: any) => {
    setSelectedClaim(claim);
    setResolutionNotes(claim.resolutionNotes || '');
    setNewStatus(claim.status || 'Submitted');
  };

  const handleSaveClaim = async () => {
    if (!selectedClaim) return;
    setIsSaving(true);
    try {
      await updateWarrantyClaimStatusAction({ 
        id: selectedClaim.id, 
        status: newStatus,
        resolutionNotes 
      });
      toast.success(`Claim #${selectedClaim.claimNumber || selectedClaim.id} status updated successfully!`);
      setClaimsList((prev) => 
        prev.map((c: any) => 
          c.id === selectedClaim.id 
            ? { ...c, status: newStatus, resolutionNotes } 
            : c
        )
      );
      setSelectedClaim(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update warranty claim.');
    } finally {
      setIsSaving(false);
    }
  };

  const getClaimStatusBadge = (status: string) => {
    switch ((status || "").toUpperCase()) {
      case 'COMPLETED':
        return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">Completed</Badge>;
      case 'IN PROGRESS':
      case 'IN_PROGRESS':
      case 'UNDER_REPAIR':
        return <Badge className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs">In Progress</Badge>;
      case 'APPROVED':
        return <Badge className="bg-teal-500 text-white rounded-full px-3 py-1 text-xs">Approved</Badge>;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <Badge variant="warning" className="rounded-full px-3 py-1 text-xs">Submitted</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">Rejected</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs text-muted-foreground border-border">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-border">{status}</Badge>;
    }
  };

  return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
              <Link href="/admin/warranties" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center font-medium">
                <ArrowLeft className="h-4 w-4 mr-1" /> All Warranties
              </Link>
              <span>/</span>
              <span className="text-foreground font-semibold">Claims & Servicing Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Warranty Claims & Servicing Desk</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">Process customer reported defects, assign servicing/repairs, update claim status, and enter technician resolution reports.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Submitted</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{claimsList.filter((c: any) => (c.status || "").toLowerCase() === 'submitted').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Wrench className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">In Progress / Approved</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{claimsList.filter((c: any) => ['in progress', 'approved'].includes((c.status || "").toLowerCase())).length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Completed</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{claimsList.filter((c: any) => (c.status || "").toLowerCase() === 'completed').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl">
                  <XCircle className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Rejected</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{claimsList.filter((c: any) => (c.status || "").toLowerCase() === 'rejected').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Claims Table */}
        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-border/60 bg-card flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by Claim #, Serial/Unique ID, Customer, or Product..." 
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
              <option value="ALL">All Claim Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {filteredClaims.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground font-medium">No warranty claims found.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border/60">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Claim ID</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Unique ID / Product</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Customer</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Reported Issue</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Submitted Date</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground whitespace-nowrap">Status</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-muted-foreground text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredClaims.map((claim: any) => (
                    <tr key={claim.id} className="hover:bg-muted/30 transition-colors bg-card">
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-foreground">
                        #{claim.claimNumber || claim.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{claim.uniqueId}</div>
                        <div className="text-xs text-muted-foreground font-medium">{claim.productName}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-foreground">
                        <div className="font-semibold">{claim.customerName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{claim.customerPhone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-muted-foreground max-w-xs truncate" title={claim.issueDescription}>
                        {claim.issueDescription}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-muted-foreground">
                        {formatDateDayFirst(claim.dateSubmitted)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getClaimStatusBadge(claim.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenClaimModal(claim)}
                          className="h-9 px-3 rounded-xl text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-semibold"
                        >
                          <Wrench className="h-4 w-4 mr-1.5" /> Service / Update Status
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Claim Action Modal */}
        {selectedClaim && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-card text-card-foreground rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Process & Update Service Status</h3>
                  <p className="text-xs text-slate-400 mt-1">Claim #{selectedClaim.claimNumber || selectedClaim.id} • Serial: {selectedClaim.uniqueId}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedClaim(null)} className="text-slate-400 hover:text-white">✕</Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Customer & Product</span>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold text-foreground">{selectedClaim.customerName}</p>
                      <p className="text-xs font-mono text-muted-foreground">{selectedClaim.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{selectedClaim.productName}</p>
                      <p className="text-xs font-mono text-blue-600 dark:text-blue-400">{selectedClaim.uniqueId}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-1">
                  <span className="text-xs font-bold uppercase text-amber-900 dark:text-amber-300">Customer Reported Problem</span>
                  <p className="text-sm text-amber-950 dark:text-amber-200 font-medium">{selectedClaim.issueDescription}</p>
                </div>

                {/* Form Controls */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Update Claim / Servicing Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Submitted">Submitted (Under Review)</option>
                      <option value="Approved">Approved (Warranty Accepted)</option>
                      <option value="In Progress">In Progress (Servicing / Under Repair)</option>
                      <option value="Completed">Completed (Repaired / Replaced)</option>
                      <option value="Rejected">Rejected (Not Covered)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Resolution & Technician Service Notes</label>
                    <Textarea
                      rows={3}
                      placeholder="Add technician report, replaced parts, repair details, or rejection reasons..."
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="rounded-xl border-border bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/40 border-t border-border/60 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedClaim(null)} className="rounded-xl border-border">Cancel</Button>
                <Button 
                  onClick={handleSaveClaim} 
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20"
                >
                  <Send className="h-4 w-4 mr-2" /> {isSaving ? "Saving..." : "Save & Update Status"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
