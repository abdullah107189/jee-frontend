import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { toast } from 'sonner';

const MOCK_BRANDS = [
  { id: '1', name: 'TechPro', slug: 'techpro', status: 'Active' },
  { id: '2', name: 'ErgoLife', slug: 'ergolife', status: 'Active' },
  { id: '3', name: 'SoundMax', slug: 'soundmax', status: 'Inactive' },
];

export default function AdminBrandsPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, name: string} | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Perform delete action here
    toast.success(`Brand ${itemToDelete?.name} deleted successfully.`);
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Brands</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Manage product brands and their details.</p>
          </div>
          <Button className="h-10 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/20">
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add Brand
          </Button>
        </div>

        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search brands..." 
                className="pl-10 h-10 sm:h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Brand Name</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Slug</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_BRANDS.map((brand) => (
                  <tr key={brand.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                          {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                        {brand.name}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm text-slate-500 font-mono">{brand.slug}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge variant={brand.status === 'Active' ? 'success' : 'outline'} className="rounded-full px-3 py-1 text-xs">
                        {brand.status}
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
                        onClick={() => handleDeleteClick(brand.id, brand.name)}
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
          title="Delete Brand"
          description="Are you sure you want to delete this brand? This action cannot be undone."
          itemName={itemToDelete?.name}
        />
      </div>
    </DashboardLayout>
  );
}
