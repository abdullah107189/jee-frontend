"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  LayoutDashboard,
  PlusCircle,
  Package,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  allowedRole: "admin" | "seller" | "customer";
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function DashboardLayoutClient({
  children,
  allowedRole,
  user,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    if (path === "/seller") return pathname === path;
    return pathname?.startsWith(path);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          role={user?.role as 'admin' | 'seller' | 'customer'}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 lg:pb-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 shadow-sm z-10">
          <Link
            href="/"
            className="font-black text-xl text-slate-800 tracking-tight flex items-center"
          >
            <span className="h-3 w-3 rounded-full bg-blue-600 mr-2"></span>
            TechStore
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -mr-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="mx-auto max-w-6xl w-full">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for Sellers */}
      {user.role === "seller" && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-1.5 flex justify-around items-center shadow-lg">
          <Link
            href="/seller"
            className={cn(
              "flex flex-col items-center p-1.5 text-[11px] font-bold transition-colors",
              isActiveLink("/seller")
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            <LayoutDashboard className="h-5 w-5 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/seller/sales/new"
            className="flex flex-col items-center -mt-5"
          >
            <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 border-2 border-white">
              <PlusCircle className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-extrabold text-blue-700 mt-0.5">
              New Sale
            </span>
          </Link>

          <Link
            href="/seller/sales"
            className={cn(
              "flex flex-col items-center p-1.5 text-[11px] font-bold transition-colors",
              isActiveLink("/seller/sales")
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            <Package className="h-5 w-5 mb-0.5" />
            <span>Sales</span>
          </Link>

          <Link
            href="/seller/warranties"
            className={cn(
              "flex flex-col items-center p-1.5 text-[11px] font-bold transition-colors",
              isActiveLink("/seller/warranties")
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            <ShieldCheck className="h-5 w-5 mb-0.5" />
            <span>Warranty</span>
          </Link>

          <Link
            href="/seller/profile"
            className={cn(
              "flex flex-col items-center p-1.5 text-[11px] font-bold transition-colors",
              isActiveLink("/seller/profile")
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            <User className="h-5 w-5 mb-0.5" />
            <span>Profile</span>
          </Link>
        </div>
      )}
    </>
  );
}
