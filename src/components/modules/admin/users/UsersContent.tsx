"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Users, Shield, UserCheck, Store, Ban, CheckCircle, Edit2 } from 'lucide-react';
import type { AdminUser } from '@/services/admin.service';
import { updateUserRoleAction, updateUserStatusAction } from '@/actions/admin.actions';
import { toast } from 'sonner'; 

export default function AdminUsersPage({ users: initialUsers }: { users: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = roleFilter === 'ALL' || user.role.toUpperCase() === roleFilter.toUpperCase();
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (user.isActive ?? (user.status?.toUpperCase() === 'ACTIVE'))) ||
      (statusFilter === 'DISABLED' && !(user.isActive ?? (user.status?.toUpperCase() === 'ACTIVE')));

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleSave = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      const res = await updateUserRoleAction({ id: editingUser.id, role: selectedRole.toUpperCase() });
      if (res.success) {
        toast.success(`Role for ${editingUser.name} updated to ${selectedRole.toUpperCase()}`);
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: selectedRole.toUpperCase() } : u));
        setEditingUser(null);
      } else {
        toast.error(res.message || "Failed to update role");
      }
    } catch {
      toast.error("Failed to update role");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const currentActive = user.isActive ?? (user.status?.toUpperCase() === 'ACTIVE');
    const newStatus = !currentActive;
    try {
      const res = await updateUserStatusAction({ id: user.id, status: newStatus ? 'ACTIVE' : 'SUSPENDED' });
      if (res.success) {
        toast.success(`User ${user.name} is now ${newStatus ? 'Active' : 'Disabled'}`);
        setUsers(users.map(u => u.id === user.id ? { ...u, isActive: newStatus, status: newStatus ? 'Active' : 'Disabled' } : u));
      } else {
        toast.error(res.message || "Failed to toggle status");
      }
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 rounded-full px-2.5 py-0.5 text-xs font-bold">Admin</Badge>;
      case 'SELLER':
        return <Badge className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 rounded-full px-2.5 py-0.5 text-xs font-bold">Seller</Badge>;
      case 'CUSTOMER':
        return <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 rounded-full px-2.5 py-0.5 text-xs font-bold">Customer</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs">{role}</Badge>;
    }
  };

  const adminCount = users.filter((u) => (u.role || '').toUpperCase() === 'ADMIN').length;
  const sellerCount = users.filter((u) => (u.role || '').toUpperCase() === 'SELLER').length;
  const customerCount = users.filter((u) => (u.role || '').toUpperCase() === 'CUSTOMER').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">User Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">Manage user accounts, roles, access permissions, and account statuses.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Total Users</span>
            </div>
            <p className="text-2xl font-extrabold text-foreground">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Admins</span>
            </div>
            <p className="text-2xl font-extrabold text-foreground">{adminCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Store className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Sellers</span>
            </div>
            <p className="text-2xl font-extrabold text-foreground">{sellerCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <UserCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Customers</span>
            </div>
            <p className="text-2xl font-extrabold text-foreground">{customerCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* User Table Card */}
      <Card className="rounded-2xl sm:rounded-[2rem] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border bg-card flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search users by name, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 sm:h-12 rounded-xl w-full"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 sm:h-12 rounded-xl border border-input bg-background dark:bg-muted/40 px-4 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="SELLER">Seller</option>
            <option value="CUSTOMER">Customer</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 sm:h-12 rounded-xl border border-input bg-background dark:bg-muted/40 px-4 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-medium">No users found matching query.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">User</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Contact</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Role</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Joined Date</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-semibold text-muted-foreground text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredUsers.map((user) => {
                  const isActive = user.isActive ?? (user.status?.toUpperCase() === 'ACTIVE');
                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors bg-card">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover border border-border bg-muted" />
                          <div>
                            <div className="font-semibold text-foreground">{user.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-mono text-xs text-foreground/80">
                        {user.phone}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-muted-foreground">
                        {user.joinedDate}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {isActive ? (
                          <Badge variant="success" className="rounded-full px-2.5 py-0.5 text-xs">Active</Badge>
                        ) : (
                          <Badge variant="destructive" className="rounded-full px-2.5 py-0.5 text-xs">Disabled</Badge>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setEditingUser(user); setSelectedRole((user.role || 'customer').toLowerCase()); }}
                          className="h-8 px-2.5 rounded-lg text-primary hover:bg-primary/10 font-semibold"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit Role
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleStatus(user)}
                          className={`h-8 px-2.5 rounded-lg font-semibold ${isActive ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40' : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'}`}
                        >
                          {isActive ? <Ban className="h-3.5 w-3.5 mr-1 inline" /> : <CheckCircle className="h-3.5 w-3.5 mr-1 inline" />}
                          {isActive ? 'Disable' : 'Enable'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Change Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Change User Role</h3>
              <Button variant="ghost" size="sm" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">✕</Button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-foreground/80 font-medium">
                Select new role permissions for <span className="font-bold text-foreground">{editingUser.name}</span> ({editingUser.email}):
              </p>

              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 rounded-2xl border border-border cursor-pointer hover:bg-muted/40">
                  <input 
                    type="radio" 
                    name="role" 
                    value="admin" 
                    checked={selectedRole === 'admin'} 
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="text-primary focus:ring-ring" 
                  />
                  <div>
                    <span className="font-bold text-foreground text-sm">Administrator</span>
                    <p className="text-xs text-muted-foreground">Full system access and platform control.</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-2xl border border-border cursor-pointer hover:bg-muted/40">
                  <input 
                    type="radio" 
                    name="role" 
                    value="seller" 
                    checked={selectedRole === 'seller'} 
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="text-primary focus:ring-ring" 
                  />
                  <div>
                    <span className="font-bold text-foreground text-sm">Merchant / Seller</span>
                    <p className="text-xs text-muted-foreground">Can perform offline sales and register warranties.</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-2xl border border-border cursor-pointer hover:bg-muted/40">
                  <input 
                    type="radio" 
                    name="role" 
                    value="customer" 
                    checked={selectedRole === 'customer'} 
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="text-primary focus:ring-ring" 
                  />
                  <div>
                    <span className="font-bold text-foreground text-sm">Customer</span>
                    <p className="text-xs text-muted-foreground">Can place online orders and check warranties.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-4 bg-muted/30 border-t border-border flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setEditingUser(null)} className="rounded-xl font-bold">Cancel</Button>
              <Button 
                disabled={isUpdating}
                onClick={handleRoleSave} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold"
              >
                Save Role
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
