"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  Package,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/Button";
import type { AuthUser } from "@/lib/types/auth.types";  // ← changed

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: AuthUser;  // ← AuthUser (not CurrentUser)
}

export function DashboardLayoutClient({
  children,
  user,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (path: string) => {
    if (path === "/seller" || path === "/admin" || path === "/customer") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Dashboard navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-background transition-transform duration-300 ease-in-out",
          "lg:static lg:z-auto lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="absolute right-2 top-2 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </Button>

        <Sidebar role={user?.role} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 shadow-sm lg:hidden">
          <Link
            href="/"
            className="flex items-center text-lg font-black tracking-tight text-foreground"
            aria-label="JEE Home"
          >
            <span className="mr-2 h-3 w-3 rounded-full bg-primary" />
            JEE
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        <main
          className={cn(
            "relative flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8",
            user.role === "SELLER" && "pb-24 lg:pb-8",  // ← uppercase
          )}
        >
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Nav (seller only) */}
      {user.role === "SELLER" && (  // ← uppercase
        <nav
          aria-label="Seller quick navigation"
          className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-background/95 px-2 py-1.5 backdrop-blur-md shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] lg:hidden"
        >
          <BottomNavLink
            href="/seller"
            icon={LayoutDashboard}
            label="Home"
            isActive={isActiveLink("/seller")}
          />

          <Link
            href="/seller/sales/new"
            className="-mt-6 flex flex-col items-center"
            aria-label="Create new sale"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform active:scale-95">
              <PlusCircle className="h-6 w-6" />
            </div>
            <span className="mt-0.5 text-[10px] font-extrabold text-primary">
              New Sale
            </span>
          </Link>

          <BottomNavLink
            href="/seller/sales"
            icon={Package}
            label="Sales"
            isActive={isActiveLink("/seller/sales")}
          />
          <BottomNavLink
            href="/seller/warranties"
            icon={ShieldCheck}
            label="Warranty"
            isActive={isActiveLink("/seller/warranties")}
          />
          <BottomNavLink
            href="/seller/profile"
            icon={User}
            label="Profile"
            isActive={isActiveLink("/seller/profile")}
          />
        </nav>
      )}
    </>
  );
}

/* Bottom Nav Helper */
interface BottomNavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
}

function BottomNavLink({
  href,
  icon: Icon,
  label,
  isActive,
}: BottomNavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center rounded-lg p-1.5 text-[11px] font-bold transition-colors",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="mb-0.5 h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}