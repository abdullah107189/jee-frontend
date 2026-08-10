"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLoginMutation } from '@/lib/redux/features/auth/authApi';
import { setCredentials } from '@/lib/redux/features/auth/authSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { MainLayout } from '@/components/layout/MainLayout';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));
      toast.success(`Welcome back, ${res.user.name}`);
      router.push(`/${res.user.role}`);
    } catch (err) {
      toast.error('Failed to login');
    }
  };

  return (
    <MainLayout>
      <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white/50 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center pb-6 sm:pb-8">
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</CardTitle>
            <p className="text-sm sm:text-base text-slate-500 font-medium">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Email</label>
                <Input {...register('email')} type="email" placeholder="admin@example.com" className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white" required />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Role (Demo)</label>
                <select 
                  {...register('role')} 
                  className="flex h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm sm:text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                >
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="customer">Customer</option>
                </select>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium pt-1">Select a role to preview different dashboards</p>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Password</label>
                <Input {...register('password')} type="password" placeholder="••••••••" className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white" required />
              </div>
              <Button type="submit" className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl text-sm sm:text-base shadow-lg shadow-blue-500/25 mt-2 sm:mt-4" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
