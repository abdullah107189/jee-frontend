"use server";
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/services/auth.service';
import { Sidebar } from './Sidebar'; 
import { DashboardLayoutClient } from './DashboardLayoutClient';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole: 'admin' | 'seller' | 'customer';
}

// This is a Server Component with auth check
export async function DashboardLayout({ children, allowedRole }: DashboardLayoutProps) {
  // Get user from session/cookie
  const user = await getCurrentUser();
  
  // If no session, redirect to login
  if (!user) {
    redirect('/login');
  }
  
  // Check if user has required role
  if (user.role !== allowedRole) {
    redirect('/');
  }

  // Render the layout with user data passed to client component
  return (
    <div className="flex h-screen bg-[#eef2f6] overflow-hidden">
      <DashboardLayoutClient user={user} allowedRole={allowedRole}>
        {children}
      </DashboardLayoutClient>
    </div>
  );
}