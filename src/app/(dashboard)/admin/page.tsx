import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Package,
  ShieldCheck,
  TrendingUp,
  Store,
  Clock,
  ArrowRight,
  ShieldAlert,
  Tag,
  FileText,
  PackageSearch,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getAdminOrders } from "@/services/order.service";
import { adminProductService } from "@/services/admin/product.service";
import {
  getUsers,
  getPendingSellers,
  getAdminWarranties,
  getAdminWarrantyClaims,
} from "@/services/admin.service";

export const metadata: Metadata = {
  title: "Admin Dashboard | JEE",
  description: "Overview of your store performance.",
};

export default async function AdminDashboardPage() {
  const [ordersRes, productsRes, users, pendingSellers, warranties, claims] =
    await Promise.all([
      getAdminOrders({ limit: 1 }).catch(() => ({
        orders: [],
        total: 0,
        totalPages: 0,
      })),
      adminProductService
        .getAdminProducts({ limit: 1 })
        .catch(() => ({ data: [], meta: { total: 0 } })),
      getUsers().catch(() => []),
      getPendingSellers().catch(() => []),
      getAdminWarranties().catch(() => []),
      getAdminWarrantyClaims().catch(() => []),
    ]);

  const totalOrders = ordersRes.total ?? 0;
  const totalProducts = productsRes.meta?.total ?? 0;
  const totalUsers = users.length;
  const activeWarranties = warranties.filter(
    (w: any) => (w.status || "").toUpperCase() === "ACTIVE",
  ).length;

  const pendingClaims = claims.filter(
    (c: any) =>
      (c.status || "").toLowerCase() === "submitted" ||
      (c.rawStatus || "").toUpperCase() === "SUBMITTED",
  ).length;

  const pendingSellerCount = pendingSellers.length;

  const quickStats = [
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      subtext: "Online store orders",
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Products Catalog",
      value: totalProducts.toLocaleString(),
      subtext: "Active listed items",
      icon: Package,
      href: "/admin/products",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Registered Users",
      value: totalUsers.toLocaleString(),
      subtext: "Customers, sellers & staff",
      icon: Users,
      href: "/admin/users",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Active Warranties",
      value: activeWarranties.toLocaleString(),
      subtext: "Digital warranty coverage",
      icon: ShieldCheck,
      href: "/admin/warranties",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
          Live store metrics, platform inventory, and administrative actions.
        </p>
      </div>

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map(
          ({ label, value, subtext, icon: Icon, href, color, bg }) => (
            <Link key={label} href={href} className="group">
              <Card className="rounded-2xl border-none bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {label}
                  </span>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-slate-900">
                    {value}
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {subtext}
                  </p>
                </div>
              </Card>
            </Link>
          ),
        )}
      </div>

      {/* Action Required Banners (Pending Sellers / Claims) */}
      {(pendingSellerCount > 0 || pendingClaims > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingSellerCount > 0 && (
            <Card className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-950">
                      Pending Seller Approvals
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      {pendingSellerCount} merchant application(s) awaiting your
                      review.
                    </p>
                  </div>
                </div>
                <Link href="/admin/sellers/pending">
                  <Button
                    size="sm"
                    className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
                  >
                    Review <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {pendingClaims > 0 && (
            <Card className="rounded-2xl border border-blue-200/80 bg-blue-50/60 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-950">
                      Warranty Claims Desk
                    </h3>
                    <p className="text-xs text-blue-800 mt-0.5">
                      {pendingClaims} customer warranty claim(s) require
                      investigation.
                    </p>
                  </div>
                </div>
                <Link href="/admin/warranties/claims">
                  <Button
                    size="sm"
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                  >
                    Process <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Quick Navigation Hub */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3">
          Quick Management Portals
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              name: "Orders",
              href: "/admin/orders",
              icon: ShoppingBag,
              desc: "Manage sales",
            },
            {
              name: "Products",
              href: "/admin/products",
              icon: Package,
              desc: "Catalog & variants",
            },
            {
              name: "Categories",
              href: "/admin/categories",
              icon: PackageSearch,
              desc: "Hierarchy tree",
            },
            {
              name: "Brands",
              href: "/admin/brands",
              icon: Tag,
              desc: "Brand registry",
            },
            {
              name: "Warranties",
              href: "/admin/warranties",
              icon: ShieldCheck,
              desc: "Digital warranty",
            },
            {
              name: "Audit Logs",
              href: "/admin/audit-logs",
              icon: FileText,
              desc: "Security history",
            },
          ].map((portal) => (
            <Link key={portal.name} href={portal.href} className="group">
              <Card className="rounded-2xl border-none bg-white p-4 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <portal.icon className="h-5 w-5" />
                </div>
                <p className="mt-2 text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {portal.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {portal.desc}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
