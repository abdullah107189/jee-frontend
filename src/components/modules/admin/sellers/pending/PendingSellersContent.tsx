"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, FileText, ExternalLink, ShieldAlert, ArrowLeft } from 'lucide-react';
import { updateSellerStatusAction } from '@/actions/admin.actions';
import type { AdminSeller } from '@/services/admin.service';
import { toast } from 'sonner'; 
import Link from 'next/link';

export default function AdminPendingSellersPage({ pendingSellers }: { pendingSellers: AdminSeller[] }) {
  const [selectedDoc, setSelectedDoc] = useState<{ companyName: string; docUrl: string; licenseNo: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      await updateSellerStatusAction({ id, status: 'APPROVED' });
      toast.success(`Seller "${name}" approved successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve seller.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      await updateSellerStatusAction({ id, status: 'DISABLED', reason: 'Registration Rejected' });
      toast.error(`Seller application for "${name}" rejected.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject seller.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
            <Link href="/admin/sellers" className="hover:text-primary flex items-center font-medium">
              <ArrowLeft className="h-4 w-4 mr-1" /> All Sellers
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Pending Approvals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Pending Seller Approvals</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">Review submitted business credentials before granting merchant access.</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/60 flex items-start space-x-4">
        <div className="p-3 bg-amber-500 text-white rounded-2xl flex-shrink-0">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-amber-950 dark:text-amber-200">Verification Guidelines</h4>
          <p className="text-sm text-amber-800 dark:text-amber-300/80 mt-1">
            Please verify the trade license number, business address, and tax identification number before approving a seller. Approved sellers get authorization to register physical product items and issue instant warranties.
          </p>
        </div>
      </div>

      {/* Pending Table */}
      <Card className="rounded-2xl sm:rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          {pendingSellers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-medium">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3 opacity-80" />
              <p className="text-lg font-bold text-foreground">All caught up!</p>
              <p className="text-sm text-muted-foreground">There are no pending seller applications at this moment.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Company & Owner</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Trade License</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Tax / NID ID</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Contact</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Applied Date</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {pendingSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-muted/30 transition-colors bg-card">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-foreground">{seller.companyName}</div>
                      <div className="text-xs text-muted-foreground">Owner: {seller.ownerName}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-mono text-xs font-semibold text-foreground/90">{seller.licenseNo}</div>
                      {seller.licenseDocUrl ? (
                        <button
                          onClick={() => setSelectedDoc({ companyName: seller.companyName, docUrl: seller.licenseDocUrl!, licenseNo: seller.licenseNo })}
                          className="inline-flex items-center text-xs text-primary hover:underline font-semibold mt-1"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" /> View Document
                        </button>
                      ) : null}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs font-mono text-muted-foreground">
                      {seller.nidNumber || seller.taxId || 'N/A'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-foreground/80">
                      <div>{seller.email}</div>
                      <div className="text-xs text-muted-foreground font-mono">{seller.phone}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs font-mono text-muted-foreground">
                      {seller.joinedDate}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Button 
                        size="sm" 
                        disabled={processingId === seller.id}
                        onClick={() => handleApprove(seller.id, seller.companyName)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        disabled={processingId === seller.id}
                        onClick={() => handleReject(seller.id, seller.companyName)}
                        variant="destructive"
                        className="rounded-xl font-bold"
                      >
                        <XCircle className="h-4 w-4 mr-1.5" /> Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* License Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Trade License Document</h3>
                <p className="text-xs text-slate-400">{selectedDoc.companyName} • {selectedDoc.licenseNo}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(null)} className="text-white hover:bg-slate-800">✕</Button>
            </div>
            <div className="p-6 flex flex-col items-center">
              <img 
                src={selectedDoc.docUrl} 
                alt="Business License" 
                className="rounded-2xl max-h-[400px] w-full object-cover shadow-md border border-border"
              />
            </div>
            <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center">
              <a 
                href={selectedDoc.docUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center"
              >
                Open full resolution <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
              <Button variant="outline" onClick={() => setSelectedDoc(null)} className="rounded-xl font-bold">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
