import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react'; 
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { toast } from 'sonner';
import Link from 'next/link';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Premium Standing Desk', sku: 'DESK-001', category: 'Furniture', price: 499.99, stock: 15, status: 'PUBLISHED' },
  { id: '2', name: 'Ergonomic Chair', sku: 'CHAIR-002', category: 'Furniture', price: 249.99, stock: 8, status: 'PUBLISHED' },
  { id: '3', name: 'Wireless Mechanical Keyboard', sku: 'KEY-003', category: 'Electronics', price: 129.99, stock: 0, status: 'UNPUBLISHED' },
];

export default function AdminProductsPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, name: string} | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Perform delete action here
    toast.success(`Product ${itemToDelete?.name} deleted successfully.`);
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Products</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Manage your product catalog and inventory.</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="h-10 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/20">
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add New Product
            </Button>
          </Link>
        </div>

        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search products by name or SKU..." 
                className="pl-10 h-10 sm:h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 w-full"
              />
            </div>
            <select className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
            </select>
            <select className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Product</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Category</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Price</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Stock</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_PRODUCTS.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{product.sku}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                      {product.category}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-900 font-bold">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <span className={`font-bold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                          {product.stock}
                        </span>
                        <span className="text-slate-500 ml-1">units</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge variant={product.status === 'PUBLISHED' ? 'success' : 'outline'} className="rounded-full px-3 py-1 text-xs">
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Link href={`/admin/products/${product.id}/items`}>
                        <Button variant="ghost" size="sm" className="h-8 sm:h-10 px-2 sm:px-3 rounded-lg sm:rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold" title="Manage Items">
                          <Package className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Items</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(product.id, product.name)}
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
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
          itemName={itemToDelete?.name}
        />
      </div>
    </DashboardLayout>
  );
}
