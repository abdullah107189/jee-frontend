import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, XCircle, FileText, ExternalLink, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useGetPendingSellersQuery, useUpdateSellerStatusMutation } from '@/lib/redux/features/admin/adminApi';
import { toast } from 'sonner'; 
import Link from 'next/link';

export default function AdminPendingSellersPage() {
  const { data: pendingSellers = [], isLoading } = useGetPendingSellersQuery();
  const [updateStatus] = useUpdateSellerStatusMutation();

  const [selectedDoc, setSelectedDoc] = useState<{ companyName: string; docUrl: string; licenseNo: string } | null>(null);

  const handleApprove = async (id: string, name: string) => {
    try {
      await updateStatus({ id, status: 'Approved' }).unwrap();
      toast.success(`Seller "${name}" approved successfully!`);
    } catch (err) {
      toast.error('Failed to approve seller.');
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      await updateStatus({ id, status: 'Disabled', reason: 'Registration Rejected' }).unwrap();
      toast.error(`Seller application for "${name}" rejected.`);
    } catch (err) {
      toast.error('Failed to reject seller.');
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-1">
              <Link href="/admin/sellers" className="hover:text-blue-600 flex items-center font-medium">
                <ArrowLeft className="h-4 w-4 mr-1" /> All Sellers
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Pending Approvals</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Pending Seller Approvals</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Review submitted business credentials before granting merchant access.</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-4">
          <div className="p-3 bg-amber-500 text-white rounded-2xl flex-shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-amber-900">Verification Guidelines</h4>
            <p className="text-sm text-amber-800 mt-1">
              Please verify the trade license number, business address, and NID number against official government records before approving a seller. Approved sellers get authorization to register physical product items and issue instant warranties.
            </p>
          </div>
        </div>

        {/* Pending Table */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading pending applications...</div>
            ) : pendingSellers.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3 opacity-80" />
                <p className="text-lg font-bold text-slate-800">All caught up!</p>
                <p className="text-sm text-slate-500">There are no pending seller applications at this moment.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Company & Owner</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Trade License</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">NID Number</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Contact</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Applied Date</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingSellers.map((seller: any) => (
                    <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-semibold text-slate-900">{seller.companyName}</div>
                        <div className="text-xs text-slate-500">Owner: {seller.ownerName}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-mono text-xs font-semibold text-slate-800">{seller.licenseNo}</div>
                        <button
                          onClick={() => setSelectedDoc({ companyName: seller.companyName, docUrl: seller.licenseDocUrl, licenseNo: seller.licenseNo })}
                          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" /> View Document
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-slate-600">
                        {seller.nidNumber}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs text-slate-600">
                        <div>{seller.email}</div>
                        <div className="font-mono text-slate-400">{seller.phone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-slate-500">
                        {seller.joinedDate}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          onClick={() => handleApprove(seller.id, seller.companyName)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20"
                        >
                          <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
                        </Button>
                        <Button 
                          onClick={() => handleReject(seller.id, seller.companyName)}
                          size="sm"
                          variant="destructive"
                          className="rounded-xl"
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
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
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
                  className="rounded-2xl max-h-[400px] w-full object-cover shadow-md border border-slate-200"
                />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <a 
                  href={selectedDoc.docUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center"
                >
                  Open full resolution <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
                <Button variant="outline" onClick={() => setSelectedDoc(null)} className="rounded-xl">Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
