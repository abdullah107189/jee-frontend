import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useGetSellerProfileQuery, useUpdateSellerProfileMutation, useChangeSellerPasswordMutation } from '@/lib/redux/features/seller/sellerApi';
import { toast } from 'sonner';
import { User, Store, Mail, Phone, MapPin, ShieldCheck, Calendar, Edit2, Lock, Banknote, Package, Award } from 'lucide-react';

export default function SellerProfilePage() {
  const { data: profile, isLoading } = useGetSellerProfileQuery();
  const [updateProfile] = useUpdateSellerProfileMutation();
  const [changePassword] = useChangeSellerPasswordMutation();

  // Edit Profile modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNo, setLicenseNo] = useState('');

  // Password Modal state
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOpenEdit = () => {
    if (!profile) return;
    setCompanyName(profile.companyName || '');
    setOwnerName(profile.ownerName || '');
    setPhone(profile.phone || '');
    setAddress(profile.address || '');
    setLicenseNo(profile.businessLicense || '');
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        companyName,
        ownerName,
        phone,
        address,
        businessLicense: licenseNo
      }).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditOpen(false);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success('Password changed successfully!');
      setIsPasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Failed to change password');
    }
  };

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">My Profile</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Manage merchant outlet profile details and account security.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleOpenEdit} variant="outline" className="rounded-xl bg-white font-bold">
              <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
            <Button onClick={() => setIsPasswordOpen(true)} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20">
              <Lock className="h-4 w-4 mr-2" /> Change Password
            </Button>
          </div>
        </div>

        {isLoading || !profile ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading profile details...</div>
        ) : (
          <div className="space-y-6">
            {/* Top Merchant Profile Card */}
            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                    <Store className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">{profile.companyName}</h2>
                    <p className="text-sm text-blue-200 font-medium mt-0.5">Owner: {profile.ownerName} • Lic: {profile.businessLicense}</p>
                  </div>
                </div>
                <Badge variant="success" className="bg-emerald-500 text-white font-extrabold px-4 py-1.5 rounded-full text-xs">
                  ✅ Account {profile.status}
                </Badge>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Email Address (Read-only)</span>
                    <p className="font-semibold text-slate-800 text-sm flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-slate-400" /> {profile.email}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Contact Phone</span>
                    <p className="font-mono font-semibold text-slate-800 text-sm flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-slate-400" /> {profile.phone}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Outlet Address</span>
                    <p className="font-semibold text-slate-800 text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-slate-400" /> {profile.address}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Trade License #</span>
                    <p className="font-mono font-bold text-slate-800 text-sm">{profile.businessLicense}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Account Status</span>
                    <p className="font-bold text-emerald-600 text-sm">✅ {profile.status}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Joined Date</span>
                    <p className="font-mono font-semibold text-slate-700 text-sm">{profile.joinedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Merchant Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Package className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Count</span>
                </div>
                <p className="text-3xl font-black text-slate-900">{profile.stats?.totalSales}</p>
              </Card>

              <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Banknote className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                </div>
                <p className="text-3xl font-black text-slate-900">৳ {profile.stats?.totalRevenue?.toLocaleString()}</p>
              </Card>

              <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Warranties</span>
                </div>
                <p className="text-3xl font-black text-slate-900">{profile.stats?.activeWarranties}</p>
              </Card>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="text-lg font-bold">Edit Merchant Profile</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">✕</Button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Company Name</label>
                  <Input 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Owner Name</label>
                  <Input 
                    value={ownerName} 
                    onChange={(e) => setOwnerName(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Phone Number</label>
                  <Input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Business License #</label>
                  <Input 
                    value={licenseNo} 
                    onChange={(e) => setLicenseNo(e.target.value)} 
                    className="rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Outlet Address</label>
                  <Input 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl">Cancel</Button>
                  <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">Save Profile</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {isPasswordOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="text-lg font-bold">Change Password</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsPasswordOpen(false)} className="text-slate-400 hover:text-white">✕</Button>
              </div>

              <form onSubmit={handleSavePassword} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Current Password</label>
                  <Input 
                    type="password"
                    required
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">New Password</label>
                  <Input 
                    type="password"
                    required
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Confirm New Password</label>
                  <Input 
                    type="password"
                    required
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsPasswordOpen(false)} className="rounded-xl">Cancel</Button>
                  <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">Update Password</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
