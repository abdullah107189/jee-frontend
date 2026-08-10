import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Users, UserCheck, Shield, Store, User, Ban, Edit2, CheckCircle, Eye } from 'lucide-react';
import { useGetUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from '@/lib/redux/features/admin/adminApi';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState('');

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = roleFilter === 'ALL' || user.role.toUpperCase() === roleFilter.toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || user.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleSave = async () => {
    if (!editingUser) return;
    try {
      await updateUserRole({ id: editingUser.id, role: selectedRole }).unwrap();
      toast.success(`Role for ${editingUser.name} updated to ${selectedRole}`);
      setEditingUser(null);
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
    try {
      await updateUserStatus({ id: user.id, status: newStatus }).unwrap();
      toast.success(`Account for ${user.name} is now ${newStatus}`);
    } catch (err) {
      toast.error('Failed to change user account status');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return <Badge className="bg-purple-600 text-white rounded-full px-3 py-1 text-xs"><Shield className="h-3 w-3 mr-1 inline" /> Admin</Badge>;
      case 'SELLER':
        return <Badge className="bg-blue-600 text-white rounded-full px-3 py-1 text-xs"><Store className="h-3 w-3 mr-1 inline" /> Seller</Badge>;
      case 'CUSTOMER':
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs text-slate-700"><User className="h-3 w-3 mr-1 inline" /> Customer</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{role}</Badge>;
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">User Management</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Manage user accounts, roles, access permissions, and account statuses.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Users</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{users.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Admins</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{users.filter((u: any) => u.role === 'admin').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Store className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Sellers</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{users.filter((u: any) => u.role === 'seller').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <UserCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Customers</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{users.filter((u: any) => u.role === 'customer').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* User Table Card */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search users by name, email, or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 w-full"
              />
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="SELLER">Seller</option>
              <option value="CUSTOMER">Customer</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading user list...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No users found matching query.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">User</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Contact</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Role</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Joined Date</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Status</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover border border-slate-200" />
                          <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-mono text-xs text-slate-600">
                        {user.phone}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-slate-500">
                        {user.joinedDate}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {user.status === 'Active' ? (
                          <Badge variant="success" className="rounded-full px-2.5 py-0.5 text-xs">Active</Badge>
                        ) : (
                          <Badge variant="destructive" className="rounded-full px-2.5 py-0.5 text-xs">Disabled</Badge>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setEditingUser(user); setSelectedRole(user.role); }}
                          className="h-8 px-2.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit Role
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleStatus(user)}
                          className={`h-8 px-2.5 rounded-lg font-semibold ${user.status === 'Active' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        >
                          {user.status === 'Active' ? <Ban className="h-3.5 w-3.5 mr-1 inline" /> : <CheckCircle className="h-3.5 w-3.5 mr-1 inline" />}
                          {user.status === 'Active' ? 'Disable' : 'Enable'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Change Role Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="text-lg font-bold">Change User Role</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">✕</Button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 font-medium">
                  Select new role permissions for <span className="font-bold text-slate-900">{editingUser.name}</span> ({editingUser.email}):
                </p>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="role" 
                      value="admin" 
                      checked={selectedRole === 'admin'} 
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500" 
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm">Administrator</span>
                      <p className="text-xs text-slate-500">Full system access and platform control.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="role" 
                      value="seller" 
                      checked={selectedRole === 'seller'} 
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500" 
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm">Merchant / Seller</span>
                      <p className="text-xs text-slate-500">Can perform offline sales and register warranties.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="role" 
                      value="customer" 
                      checked={selectedRole === 'customer'} 
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500" 
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm">Customer</span>
                      <p className="text-xs text-slate-500">Can place online orders and check warranties.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setEditingUser(null)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleRoleSave} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Save Role</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
