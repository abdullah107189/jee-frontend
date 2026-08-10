"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useBulkAddProductItemsMutation } from '@/lib/redux/features/admin/adminApi';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, Save, ArrowLeft } from 'lucide-react'; 
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ProductItemRow {
  id: string;
  uniqueId: string;
  serialNumber: string;
  status: 'AVAILABLE' | 'RESERVED' | 'DAMAGED';
}

export default function AdminProductItemsPage() {
  const { productId } = useParams<{ productId: string }>();
  const [rows, setRows] = useState<ProductItemRow[]>([
    { id: '1', uniqueId: '', serialNumber: '', status: 'AVAILABLE' }
  ]);
  const [bulkAdd, { isLoading }] = useBulkAddProductItemsMutation();

  const addRow = () => {
    setRows([...rows, { id: Math.random().toString(), uniqueId: '', serialNumber: '', status: 'AVAILABLE' }]);
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) return;
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof ProductItemRow, value: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = async () => {
    const validRows = rows.filter(r => r.uniqueId.trim() !== '');
    
    if (validRows.length === 0) {
      return toast.error("No valid items to submit.");
    }

    // Check for duplicates in the current list
    const ids = validRows.map(r => r.uniqueId);
    if (new Set(ids).size !== ids.length) {
      return toast.error("Duplicate Unique IDs found in your list.");
    }

    // Validate format
    const formatRegex = /^[A-Z0-9-]+$/;
    const hasInvalidFormat = ids.some(id => !formatRegex.test(id));
    if (hasInvalidFormat) {
      return toast.error("Unique IDs must contain only uppercase letters, numbers, and hyphens.");
    }

    try {
      const res = await bulkAdd({ productId, items: validRows }).unwrap();
      toast.success(res.message);
      setRows([{ id: Math.random().toString(), uniqueId: '', serialNumber: '', status: 'AVAILABLE' }]);
    } catch (err) {
      toast.error("Failed to add items");
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <Link href="/admin/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 mb-4 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Product Items</h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Bulk add physical units for product ID: <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{productId}</span></p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Button variant="outline" className="h-10 sm:h-12 rounded-xl sm:rounded-2xl border-slate-200 text-slate-600 bg-white">
                <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" /> Import CSV
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="h-10 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/20">
                <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Save {rows.filter(r => r.uniqueId).length} Items
              </Button>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Bulk Add Items</h2>
            <p className="text-sm text-slate-500 mt-1">Unique ID is required and must contain only uppercase letters, numbers, and hyphens.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap hidden sm:table-cell w-12">#</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap w-[30%]">Unique ID *</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap w-[30%]">Serial Number</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap w-[25%]">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap w-[15%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row, index) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-slate-500 font-medium hidden sm:table-cell">{index + 1}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <Input 
                        value={row.uniqueId}
                        onChange={(e) => updateRow(row.id, 'uniqueId', e.target.value.toUpperCase())}
                        placeholder="e.g. FAN-001928"
                        className="font-mono uppercase w-full h-10 sm:h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Input 
                        value={row.serialNumber}
                        onChange={(e) => updateRow(row.id, 'serialNumber', e.target.value)}
                        placeholder="Optional S/N"
                        className="font-mono w-full h-10 sm:h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <select 
                        value={row.status}
                        onChange={(e) => updateRow(row.id, 'status', e.target.value)}
                        className="w-full h-10 sm:h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="DAMAGED">DAMAGED</option>
                      </select>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length === 1}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl ml-auto"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 border-t border-slate-50 bg-slate-50/50">
            <Button variant="outline" onClick={addRow} className="border-dashed border-2 h-10 sm:h-12 rounded-xl sm:rounded-2xl border-slate-200 text-slate-600 bg-white shadow-sm w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add Row
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
