// app/(dashboard)/components/Sidebar.tsx - Update with correct routes

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Shield,
  User,
  LogOut,
} from 'lucide-react';

const customerRoutes = [
  {
    title: 'Dashboard',
    href: '/customer',
    icon: LayoutDashboard,
  },
  {
    title: 'My Orders',
    href: '/customer/orders',
    icon: Package,
  },
  {
    title: 'My Warranties',
    href: '/customer/warranties',
    icon: Shield,
  },
  {
    title: 'Profile',
    href: '/customer/profile',
    icon: User,
  },
];

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Customer Panel
        </h2>
        <div className="space-y-1">
          {customerRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname === route.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}