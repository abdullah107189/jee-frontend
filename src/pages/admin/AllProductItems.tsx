import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Edit, Trash2, Filter } from 'lucide-react';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { toast } from 'sonner';

const MOCK_ALL_ITEMS = [
  { id: '1', productName: 'Premium Standing Desk', uniqueId: 'FAN-001', serialNumber: 'SN-001', status: 'AVAILABLE', createdAt: '2023-10-24' },
  { id: '2', productName: 'Premium Standing Desk', uniqueId: 'FAN-002', serialNumber: 'SN-002', status: 'SOLD', createdAt: '2023-10-24' },
  { id: '3', productName: 'Ergonomic Chair', uniqueId: 'CHR-001', serialNumber: 'SN-003', status: 'RESERVED', createdAt: '2023-10-25' },
  { id: '4', productName: 'Ergonomic Chair', uniqueId: 'CHR-002', serialNumber: 'SN-004', status: 'DAMAGED', createdAt: '2023-10-25' },
];

export default function AdminAllProductItemsPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, name: string} | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Perform delete action here
    toast.success(`Item ${itemToDelete?.name} deleted successfully.`);
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">All Product Items</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Global view of all physical units across products.</p>
          </div>
        </div>

        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by Unique ID or Serial Number..." 
                className="pl-10 h-10 sm:h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 w-full"
              />
            </div>
            <select className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="RESERVED">Reserved</option>
              <option value="DAMAGED">Damaged</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap hidden sm:table-cell">#</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Product</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Unique ID</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Serial Number</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_ALL_ITEMS.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="px-4 sm:px-6 py-4 text-slate-500 font-medium hidden sm:table-cell">
                      {index + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-slate-900">{item.productName}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-bold font-mono text-slate-800">{item.uniqueId}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm text-slate-500 font-mono">{item.serialNumber || '-'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge 
                        variant={
                          item.status === 'AVAILABLE' ? 'success' : 
                          item.status === 'SOLD' ? 'destructive' : 
                          item.status === 'RESERVED' ? 'default' : 'outline'
                        } 
                        className="rounded-full px-3 py-1 text-xs"
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(item.id, item.uniqueId)}
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Product Item"
          description="Are you sure you want to delete this specific item? This action cannot be undone."
          itemName={itemToDelete?.name}
        />
      </div>
    </DashboardLayout>
  );
}
