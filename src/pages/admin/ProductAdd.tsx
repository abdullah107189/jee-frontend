import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, ArrowLeft, Upload, Plus, Trash2, Image as ImageIcon } from 'lucide-react'; 
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminProductAddPage() {
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Product created successfully!");
  };

  return (
    <DashboardLayout allowedRole="admin">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        <div>
          <Link href="/admin/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 mb-4 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Add New Product</h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Create a new product in your catalog.</p>
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" className="h-10 sm:h-12 rounded-xl sm:rounded-2xl border-slate-200 text-slate-600 bg-white">
                Cancel
              </Button>
              <Button type="submit" className="h-10 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/20">
                <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Save Product
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">General Information</h3>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Product Name <span className="text-red-500">*</span></label>
                  <Input required placeholder="e.g. Premium Standing Desk" className="h-12 rounded-xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea 
                    className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="Enter product description..."
                  />
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Pricing & Inventory</h3>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Price ($) <span className="text-red-500">*</span></label>
                  <Input type="number" step="0.01" required placeholder="0.00" className="h-12 rounded-xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Compare at Price ($)</label>
                  <Input type="number" step="0.01" placeholder="0.00" className="h-12 rounded-xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Cost Price ($)</label>
                  <Input type="number" step="0.01" placeholder="0.00" className="h-12 rounded-xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">SKU</label>
                  <Input placeholder="e.g. PROD-001" className="h-12 rounded-xl bg-slate-50 font-mono" />
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Specifications</h3>
                <Button type="button" variant="outline" size="sm" onClick={addSpec} className="rounded-lg h-9">
                  <Plus className="h-4 w-4 mr-2" /> Add Spec
                </Button>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 space-y-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <Input 
                      placeholder="e.g. Weight" 
                      value={spec.key}
                      onChange={(e) => updateSpec(index, 'key', e.target.value)}
                      className="h-12 rounded-xl bg-slate-50 flex-1" 
                    />
                    <Input 
                      placeholder="e.g. 5 kg" 
                      value={spec.value}
                      onChange={(e) => updateSpec(index, 'value', e.target.value)}
                      className="h-12 rounded-xl bg-slate-50 flex-1" 
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => removeSpec(index)}
                      className="h-12 w-12 p-0 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                {specs.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No specifications added yet.</p>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Organization</h3>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                    <option value="published">Published</option>
                    <option value="unpublished">Unpublished</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Brand</label>
                  <select className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                    <option value="">Select Brand</option>
                    <option value="brand_a">Brand A</option>
                    <option value="brand_b">Brand B</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Warranty Details</h3>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Warranty Period (Months) <span className="text-red-500">*</span></label>
                  <Input type="number" required placeholder="12" className="h-12 rounded-xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Warranty Terms</label>
                  <textarea 
                    className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    placeholder="Enter warranty terms..."
                  />
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Product Images</h3>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <input 
                    type="file" 
                    id="image-upload" 
                    className="hidden" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="h-12 w-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Upload ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
