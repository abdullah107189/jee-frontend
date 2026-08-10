"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; 
import { Badge } from '@/components/ui/Badge';
import { Search, ShieldAlert, ArrowLeft, CheckCircle, Clock, XCircle, Wrench, Eye, Send, FileText } from 'lucide-react';
import { useGetWarrantyClaimsQuery, useUpdateWarrantyClaimStatusMutation } from '@/lib/redux/features/admin/adminApi';
import { toast } from 'sonner';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function AdminWarrantyClaimsPage() {
  const { data: claims = [], isLoading } = useGetWarrantyClaimsQuery();
  const [updateClaimStatus] = useUpdateWarrantyClaimStatusMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

  const [resolutionNotes, setResolutionNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const filteredClaims = claims.filter((claim: any) => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || claim.status.toUpperCase().replace(/\s+/g, '_') === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleOpenClaimModal = (claim: any) => {
    setSelectedClaim(claim);
    setResolutionNotes(claim.resolutionNotes || '');
    setNewStatus(claim.status);
  };

  const handleSaveClaim = async () => {
    if (!selectedClaim) return;
    try {
      await updateClaimStatus({ 
        id: selectedClaim.id, 
        status: newStatus,
        resolutionNotes 
      }).unwrap();
      toast.success(`Claim #${selectedClaim.id} updated successfully!`);
      setSelectedClaim(null);
    } catch (err) {
      toast.error('Failed to update warranty claim.');
    }
  };

  const getClaimStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">Completed</Badge>;
      case 'IN PROGRESS':
        return <Badge className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs">In Progress</Badge>;
      case 'APPROVED':
        return <Badge className="bg-teal-500 text-white rounded-full px-3 py-1 text-xs">Approved</Badge>;
      case 'SUBMITTED':
        return <Badge variant="warning" className="rounded-full px-3 py-1 text-xs">Submitted</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-1">
              <Link href="/admin/warranties" className="hover:text-blue-600 flex items-center font-medium">
                <ArrowLeft className="h-4 w-4 mr-1" /> All Warranties
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Warranty Claims</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Warranty Claims Desk</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Review customer reported issues, assign repair technicians, and add resolution reports.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Submitted</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{claims.filter((c: any) => c.status === 'Submitted').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Wrench className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">In Progress</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{claims.filter((c: any) => c.status === 'In Progress' || c.status === 'Approved').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Completed</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{claims.filter((c: any) => c.status === 'Completed').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  <XCircle className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Rejected</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{claims.filter((c: any) => c.status === 'Rejected').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Claims Table */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by Claim #, Unique ID, Customer, or Product..." 
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
              <option value="ALL">All Claim Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading warranty claims...</div>
            ) : filteredClaims.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No claims found.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Claim ID</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Unique ID / Product</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Customer</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Reported Issue</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Submitted Date</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Status</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredClaims.map((claim: any) => (
                    <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-slate-900">
                        #{claim.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-mono font-bold text-blue-600">{claim.uniqueId}</div>
                        <div className="text-xs text-slate-600 font-medium">{claim.productName}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-700">
                        <div className="font-semibold">{claim.customerName}</div>
                        <div className="text-xs text-slate-400 font-mono">{claim.customerPhone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-600 max-w-xs truncate">
                        {claim.issueDescription}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-slate-500">
                        {claim.dateSubmitted}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getClaimStatusBadge(claim.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenClaimModal(claim)}
                          className="h-9 px-3 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                        >
                          <Eye className="h-4 w-4 mr-1.5" /> Process
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
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Process Claim #{selectedClaim.id}</h3>
                  <p className="text-xs text-slate-400 mt-1">Unique Product ID: {selectedClaim.uniqueId}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedClaim(null)} className="text-slate-400 hover:text-white">✕</Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Customer & Product</span>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{selectedClaim.customerName}</p>
                      <p className="text-xs font-mono text-slate-500">{selectedClaim.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{selectedClaim.productName}</p>
                      <p className="text-xs font-mono text-blue-600">{selectedClaim.uniqueId}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
                  <span className="text-xs font-bold uppercase text-amber-900">Reported Problem</span>
                  <p className="text-sm text-amber-950 font-medium">{selectedClaim.issueDescription}</p>
                </div>

                {/* Form Controls */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Update Claim Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Resolution & Service Notes</label>
                    <Textarea
                      rows={3}
                      placeholder="Add technician report, part replacements, or rejection reasons..."
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedClaim(null)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleSaveClaim} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
                  <Send className="h-4 w-4 mr-2" /> Update Claim
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
