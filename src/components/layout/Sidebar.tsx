import React, { useState } from 'react'; 
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShieldCheck, 
  Users,
  ShoppingCart,
  LogOut,
  ScanBarcode,
  Tags,
  BarChart,
  FileText,
  UserCog,
  Settings,
  ChevronDown,
  User,
  Plus
} from 'lucide-react';
import { logout } from '@/lib/redux/features/auth/authSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const MenuItem: React.FC<{ item: any; isActive: boolean; pathname: string }> = ({ item, isActive, pathname }) => {
  const [isOpen, setIsOpen] = useState(isActive || (item.subItems && item.subItems.some((sub: any) => pathname === sub.href)));

  if (item.subItems) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "group flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200",
            (isActive || isOpen)
              ? "bg-slate-50 text-slate-900" 
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <div className="flex items-center">
            <item.icon className={cn(
              "mr-4 h-5 w-5 shrink-0 transition-colors", 
              (isActive || isOpen) ? "text-slate-600" : "text-slate-400 group-hover:text-slate-600"
            )} />
            {item.name}
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} />
        </button>
        {isOpen && (
          <div className="pl-11 pr-2 space-y-1 py-1">
            {item.subItems.map((sub: any) => (
              <Link
                key={sub.name}
                href={sub.href}
                className={cn(
                  "block rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  pathname === sub.href
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Highlighted primary button item (e.g., New Sale)
  if (item.isPrimary) {
    return (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 my-2",
          isActive && "ring-2 ring-blue-400 ring-offset-2"
        )}
      >
        <div className="flex items-center">
          <item.icon className="mr-3 h-5 w-5 shrink-0 text-white" />
          <span>{item.name}</span>
        </div>
        <span className="bg-white/20 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-extrabold">CTA</span>
      </Link>
    );
  }

  return (
    <Link href={item.href}
      className={cn(
        "group flex items-center rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200",
        isActive 
          ? "bg-blue-50 text-blue-700 shadow-sm" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <item.icon className={cn(
        "mr-4 h-5 w-5 shrink-0 transition-colors", 
        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
      )} />
      {item.name}
    </Link>
  );
};

export function Sidebar({ role, onClose }: { role: 'admin' | 'seller' | 'customer', onClose?: () => void }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const menu = {
    admin: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { 
        name: 'Products', 
        href: '#', 
        icon: Package,
        subItems: [
          { name: 'All Products', href: '/admin/products' },
          { name: 'Add Product', href: '/admin/products/new' },
          { name: 'Product Items', href: '/admin/items' },
          { name: 'Categories', href: '/admin/categories' },
        ]
      },
      { name: 'Brands', href: '/admin/brands', icon: Tags },
      { 
        name: 'Sellers', 
        href: '#', 
        icon: Users,
        subItems: [
          { name: 'All Sellers', href: '/admin/sellers' },
          { name: 'Pending Approvals', href: '/admin/sellers/pending' },
        ]
      },
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { 
        name: 'Warranties', 
        href: '#', 
        icon: ShieldCheck,
        subItems: [
          { name: 'All Warranties', href: '/admin/warranties' },
          { name: 'Claims', href: '/admin/warranties/claims' },
        ]
      },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
      { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
      { name: 'Users', href: '/admin/users', icon: UserCog },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
    seller: [
      { name: 'Dashboard', href: '/seller', icon: LayoutDashboard },
      { name: 'New Sale', href: '/seller/sales/new', icon: PlusCircle, isPrimary: true },
      { name: 'Sales History', href: '/seller/sales', icon: Package },
      { name: 'Warranties', href: '/seller/warranties', icon: ShieldCheck },
      { name: 'Profile', href: '/seller/profile', icon: User },
    ],
    customer: [
      { name: 'Dashboard', href: '/customer', icon: LayoutDashboard },
      { name: 'My Orders', href: '/customer/orders', icon: ShoppingCart },
      { name: 'Warranty Check', href: '/warranty', icon: ShieldCheck },
    ]
  };

  const links = menu[role];

  return (
    <div className="flex h-full w-[280px] sm:w-72 flex-col bg-white border-r border-slate-100 shadow-[4px_0_24px_rgb(0,0,0,0.02)] z-10 px-4 py-6">
      <div className="mb-8 lg:mb-10 px-2 lg:px-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-lg mr-3 shadow-lg shadow-blue-500/30 flex items-center justify-center">
              <ScanBarcode className="text-white h-5 w-5" />
            </div>
            TechStore
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-2 lg:mt-3 ml-11">{role} Portal</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <LogOut className="h-5 w-5 rotate-180" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <nav className="space-y-1">
          {links.map((item) => (
            <MenuItem 
              key={item.name} 
              item={item} 
              isActive={pathname === item.href} 
              pathname={pathname || ''} 
            />
          ))}
        </nav>
      </div>
      <div className="mt-6 px-2">
        <button
          onClick={() => dispatch(logout())}
          className="group flex w-full items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5 shrink-0 text-slate-400 group-hover:text-red-500 transition-colors" />
          Logout
        </button>
      </div>
    </div>
  );
}
