import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { getSellerDashboardStats, getSellerProfile } from "@/services/seller.service";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Banknote,
  Package,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Receipt,
  Store,
  Clock,
  Barcode,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Seller Dashboard | JEE",
  description: "Manage in-store sales, customer receipts, and product warranties.",
};

export default async function SellerDashboardPage() {
  const user = await auth();
  if (!user) redirect("/login");

  const [stats, profile] = await Promise.all([
    getSellerDashboardStats(),
    getSellerProfile(),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Merchant Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {profile.companyName || "Merchant Store"}
            </h1>
            <Badge variant="success" className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase">
              {profile.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {user.name} · Outlet ID: <span className="font-mono">{profile.id ? profile.id.slice(0, 10) : "SELLER"}</span>
          </p>
        </div>

        {/* Quick Action Button */}
        <Link href="/seller/sales/new">
          <Button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Offline Sale (POS)</span>
          </Button>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Banknote className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-foreground tabular-nums">
            ৳{stats.totalSalesAmount.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            From {stats.totalOrders} total completed sales
          </p>
        </Card>

        {/* Today's Sales */}
        <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Today&apos;s Sales
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-600 tabular-nums">
            ৳{stats.todaysSales.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.todaysSalesCount} items sold today
          </p>
        </Card>

        {/* Active Warranties */}
        <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Warranties
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-foreground tabular-nums">
            {stats.activeWarranties}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Currently protected units
          </p>
        </Card>

        {/* Total Sales Count */}
        <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Invoices
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-foreground tabular-nums">
            {stats.totalOrders}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Registered offline transactions
          </p>
        </Card>
      </div>

      {/* Recent Sales Section */}
      <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest offline customer sales and issued digital warranties.
            </p>
          </div>
          <Link href="/seller/sales">
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-1.5">
              <span>View All Sales</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Invoice / Date</th>
                <th className="px-6 py-3.5">Product & Serial</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.recentSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                    No transactions recorded yet. Tap &quot;New Offline Sale&quot; to make your first sale.
                  </td>
                </tr>
              ) : (
                stats.recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-foreground">{sale.invoiceNumber}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(sale.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground text-sm">{sale.product}</p>
                      <p className="font-mono text-xs text-primary mt-0.5 flex items-center gap-1">
                        <Barcode className="h-3 w-3" />
                        <span>{sale.serialNumber}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{sale.customerName}</p>
                      <p className="text-xs text-muted-foreground">{sale.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground tabular-nums">৳{sale.amount.toLocaleString()}</p>
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {sale.paymentMethod}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/seller/sales/${sale.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold text-primary hover:bg-primary/10">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}