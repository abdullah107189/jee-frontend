import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Settings, CreditCard, ShieldCheck, Database, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'warranty' | 'security'>('general');

  // Form states
  const [storeName, setStoreName] = useState('TechStore Bangladesh');
  const [supportEmail, setSupportEmail] = useState('support@techstore.bd');
  const [supportPhone, setSupportPhone] = useState('+880 1700-000000');
  const [currency, setCurrency] = useState('BDT (৳)');

  const [bkashMerchant, setBkashMerchant] = useState('01700112233');
  const [bkashAppKey, setBkashAppKey] = useState('bk_app_key_88921093128');
  const [codEnabled, setCodEnabled] = useState(true);

  const [defaultWarrantyMonths, setDefaultWarrantyMonths] = useState(12);
  const [warrantyTerms, setWarrantyTerms] = useState('Covers manufacturing defects for motor and mainboard components. Physical, liquid or accidental damage voids warranty automatically.');

  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System configuration saved successfully!');
  };

  const handleBackupDatabase = () => {
    toast.success('Database snapshot generated and downloaded.');
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">System Settings</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Configure store parameters, payment gateway integration, and warranty rules.</p>
          </div>
        </div>

        {/* Settings Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center ${activeTab === 'general' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <Settings className="h-4 w-4 mr-2" /> General
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center ${activeTab === 'payment' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <CreditCard className="h-4 w-4 mr-2" /> Payment Gateway
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center ${activeTab === 'warranty' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <ShieldCheck className="h-4 w-4 mr-2" /> Warranty Rules
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            <Database className="h-4 w-4 mr-2" /> Security & Backup
          </button>
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSaveSettings}>
          <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b pb-3">General Store Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Store Name</label>
                      <Input 
                        value={storeName} 
                        onChange={(e) => setStoreName(e.target.value)} 
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Display Currency</label>
                      <Input 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)} 
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Support Email</label>
                      <Input 
                        type="email"
                        value={supportEmail} 
                        onChange={(e) => setSupportEmail(e.target.value)} 
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Support Phone Hotline</label>
                      <Input 
                        value={supportPhone} 
                        onChange={(e) => setSupportPhone(e.target.value)} 
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b pb-3">bKash & Payment Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">bKash Merchant Account Number</label>
                      <Input 
                        value={bkashMerchant} 
                        onChange={(e) => setBkashMerchant(e.target.value)} 
                        className="rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">bKash App API Key</label>
                      <Input 
                        type="password"
                        value={bkashAppKey} 
                        onChange={(e) => setBkashAppKey(e.target.value)} 
                        className="rounded-xl font-mono"
                      />
                    </div>
                    <div className="pt-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={codEnabled} 
                          onChange={(e) => setCodEnabled(e.target.checked)} 
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-bold text-slate-800">Enable Cash on Delivery (COD) Option</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'warranty' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Default Warranty Policy Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Default Warranty Period (Months)</label>
                      <Input 
                        type="number"
                        value={defaultWarrantyMonths} 
                        onChange={(e) => setDefaultWarrantyMonths(Number(e.target.value))} 
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Standard Terms & Conditions Clause</label>
                      <Textarea 
                        rows={4}
                        value={warrantyTerms} 
                        onChange={(e) => setWarrantyTerms(e.target.value)} 
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Security & System Maintenance</h3>
                  <div className="space-y-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={auditLoggingEnabled} 
                        onChange={(e) => setAuditLoggingEnabled(e.target.checked)} 
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-bold text-slate-800">Enable Comprehensive Audit Logging</span>
                        <p className="text-xs text-slate-500">Record all seller activations, product edits, and order updates to audit log.</p>
                      </div>
                    </label>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Database Snapshot & Backup</h4>
                        <p className="text-xs text-slate-500">Download snapshot of all products, items, and sales records.</p>
                      </div>
                      <Button type="button" onClick={handleBackupDatabase} variant="outline" className="rounded-xl bg-white">
                        <RefreshCw className="h-4 w-4 mr-2" /> Backup Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <Button type="submit" className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-bold">
                  <Save className="h-4 w-4 mr-2" /> Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
