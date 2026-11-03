"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Download,
  Printer,
  TrendingUp,
  Package,
  Users,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  Store,
  RefreshCw,
} from "lucide-react";
import type { AdminAnalytics } from "@/services/admin.service";
import { formatAppDate } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  analytics: AdminAnalytics;
  initialPeriod?: string;
}

export default function AnalyticsContent({ analytics, initialPeriod = "MONTH" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [period, setPeriod] = useState(initialPeriod);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    startTransition(() => {
      router.push(`/admin/analytics?period=${encodeURIComponent(newPeriod)}`);
    });
  };

  const handleExportCSV = () => {
    try {
      const rows: string[][] = [
        ["JEE Admin Analytics Report", `Period: ${period}`, `Generated: ${new Date().toISOString()}`],
        [],
        ["1. OVERVIEW SUMMARY"],
        ["Total Revenue", String(analytics.overview?.totalRevenue || 0)],
        ["Online Revenue", String(analytics.overview?.onlineRevenue || 0)],
        ["Offline Revenue", String(analytics.overview?.offlineRevenue || 0)],
        ["Total Orders", String(analytics.overview?.totalOrders || 0)],
        ["Total Products", String(analytics.overview?.totalProducts || 0)],
        ["Active Warranties", String(analytics.overview?.activeWarranties || 0)],
        ["Pending Warranty Claims", String(analytics.overview?.pendingClaims || 0)],
        ["Low Stock Items", String(analytics.overview?.lowStockCount || 0)],
        [],
        ["2. SALES TREND (ONLINE VS OFFLINE)"],
        ["Month / Period", "Online Store Revenue", "Offline Seller Revenue"],
        ...(analytics.salesTrend || []).map((t) => [t.month, String(t.online), String(t.offline)]),
        [],
        ["3. CATEGORY SALES DISTRIBUTION"],
        ["Category", "Units Sold"],
        ...(analytics.categorySales || []).map((c) => [c.category, String(c.sales)]),
        [],
        ["4. BEST SELLING PRODUCTS"],
        ["Product Name", "Category", "Units Sold", "Total Revenue"],
        ...(analytics.bestSellingProducts || []).map((p) => [
          `"${p.name.replace(/"/g, '""')}"`,
          `"${p.category.replace(/"/g, '""')}"`,
          String(p.sold),
          String(p.revenue),
        ]),
        [],
        ["5. TOP PERFORMING SELLERS"],
        ["Seller / Merchant", "Units Sold", "Gross Revenue"],
        ...(analytics.topSellers || []).map((s) => [
          `"${s.name.replace(/"/g, '""')}"`,
          String(s.sales),
          String(s.revenue),
        ]),
        [],
        ["6. LOW STOCK ALERTS"],
        ["Product", "Category", "Available Stock", "Status"],
        ...(analytics.lowStockProducts || []).map((l) => [
          `"${l.name.replace(/"/g, '""')}"`,
          `"${l.category.replace(/"/g, '""')}"`,
          String(l.stock),
          l.status,
        ]),
        [],
        ["7. EXPIRING WARRANTIES (NEXT 30 DAYS)"],
        ["Unique ID / Serial", "Product", "Customer", "Expiry Date", "Days Remaining"],
        ...(analytics.expiringWarranties || []).map((w) => [
          `"${w.uniqueId}"`,
          `"${w.product.replace(/"/g, '""')}"`,
          `"${w.customer.replace(/"/g, '""')}"`,
          formatAppDate(w.expiryDate),
          String(w.daysRemaining),
        ]),
      ];

      const csvContent = rows.map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `jee-analytics-report-${period.toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Analytics report downloaded successfully as CSV");
    } catch (err) {
      console.error("Export CSV error:", err);
      toast.error("Failed to generate CSV export");
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const overview = analytics?.overview || {
    totalRevenue: 0,
    onlineRevenue: 0,
    offlineRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
    activeWarranties: 0,
    pendingClaims: 0,
    activeSellers: 0,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Analytics & Reports
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">
            Store performance, revenue distribution, seller metrics, and warranty tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={period}
              disabled={isPending}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="h-10 sm:h-11 rounded-xl border border-border bg-card px-3 sm:px-4 text-sm font-semibold text-foreground outline-none transition focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            >
              <option value="MONTH">This Month</option>
              <option value="QUARTER">This Quarter</option>
              <option value="YEAR">This Year</option>
              <option value="ALL">All Time</option>
            </select>
            {isPending && (
              <RefreshCw className="absolute right-8 top-3 h-4 w-4 animate-spin text-muted-foreground pointer-events-none" />
            )}
          </div>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-10 sm:h-11 bg-card rounded-xl border-border text-foreground hover:bg-muted"
          >
            <Download className="mr-2 h-4 w-4 text-muted-foreground" /> Export CSV
          </Button>

          <Button
            onClick={handleExportPDF}
            className="h-10 sm:h-11 rounded-xl shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Printer className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards (60-30-10: 60% bg-card, 30% border/muted, 10% primary accent icon) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Gross Revenue
            </span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              ৳{overview.totalRevenue.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground gap-2">
              <span>Online: ৳{overview.onlineRevenue.toLocaleString()}</span>
              <span>•</span>
              <span>Offline: ৳{overview.offlineRevenue.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Completed Sales
            </span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {overview.totalOrders.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-medium">
              Orders and retail receipts combined
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Active Warranties
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {overview.activeWarranties.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-medium">
              {overview.pendingClaims > 0 ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  {overview.pendingClaims} pending claim{overview.pendingClaims > 1 ? "s" : ""}
                </span>
              ) : (
                "All claims processed"
              )}
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Low Stock Warnings
            </span>
            <div className="h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {overview.lowStockCount}
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-medium">
              {overview.lowStockCount > 0 ? "Variants near threshold" : "All inventories healthy"}
            </div>
          </div>
        </Card>
      </div>

      {/* 1️⃣ Sales & Revenue Overview */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" /> Sales & Revenue Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Line Chart */}
          <Card className="rounded-2xl border border-border bg-card lg:col-span-2 flex flex-col shadow-sm">
            <div className="p-5 sm:p-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-foreground">Sales Trend</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Online store vs Offline sellers</p>
              </div>
            </div>
            <div className="p-5 sm:p-6 flex-1 min-h-[300px]">
              {analytics?.salesTrend && analytics.salesTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.salesTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="currentColor"
                      className="text-border/40"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888888", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888888", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--card)",
                        color: "var(--foreground)",
                        boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend iconType="circle" />
                    <Line
                      type="monotone"
                      dataKey="online"
                      name="Online Store (৳)"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="offline"
                      name="Offline Sellers (৳)"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-muted-foreground text-sm">
                  <TrendingUp className="h-8 w-8 mb-2 opacity-40" />
                  No sales trend recorded yet for this period.
                </div>
              )}
            </div>
          </Card>

          {/* Sales by Category */}
          <Card className="rounded-2xl border border-border bg-card flex flex-col shadow-sm">
            <div className="p-5 sm:p-6 border-b border-border">
              <h3 className="text-base font-bold text-foreground">Sales by Category</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Units sold per category</p>
            </div>
            <div className="p-5 sm:p-6 flex-1 min-h-[300px]">
              {analytics?.categorySales && analytics.categorySales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={analytics.categorySales} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="currentColor"
                      className="text-border/40"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="category"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888888", fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--card)",
                        color: "var(--foreground)",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="sales"
                      name="Units Sold"
                      fill="#3b82f6"
                      radius={[0, 4, 4, 0]}
                      barSize={18}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-muted-foreground text-sm">
                  <Package className="h-8 w-8 mb-2 opacity-40" />
                  No category sales recorded yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 2️⃣ Product & Stock Intelligence */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center">
          <Package className="h-5 w-5 mr-2 text-primary" /> Inventory & Product Intelligence
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Selling Products */}
          <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-foreground">Best Selling Products</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Top performing items by volume</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              {analytics?.bestSellingProducts && analytics.bestSellingProducts.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                    <tr>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Units Sold</th>
                      <th className="p-4 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {analytics.bestSellingProducts.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-4 font-semibold text-foreground">{item.name}</td>
                        <td className="p-4 text-xs text-muted-foreground">{item.category}</td>
                        <td className="p-4 text-right font-bold text-foreground">{item.sold}</td>
                        <td className="p-4 text-right font-extrabold text-primary">
                          ৳{item.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No product sales recorded yet for this period.
                </div>
              )}
            </div>
          </Card>

          {/* Low Stock Alerts Table */}
          <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 border-b border-border flex justify-between items-center bg-destructive/5">
              <h3 className="text-base font-bold text-foreground flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-destructive" /> Low Stock Alerts
              </h3>
              {analytics?.lowStockProducts && analytics.lowStockProducts.length > 0 ? (
                <Badge variant="destructive" className="rounded-full text-[11px] px-2.5 py-0.5">
                  Restock Required
                </Badge>
              ) : (
                <Badge variant="outline" className="rounded-full text-[11px] px-2.5 py-0.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  Healthy Stock
                </Badge>
              )}
            </div>
            <div className="overflow-x-auto">
              {analytics?.lowStockProducts && analytics.lowStockProducts.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                    <tr>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Available Stock</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {analytics.lowStockProducts.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-4 font-semibold text-foreground">{item.name}</td>
                        <td className="p-4 text-xs text-muted-foreground">{item.category}</td>
                        <td className="p-4 font-bold text-destructive">
                          {item.stock} {item.stock === 1 ? "unit" : "units"} left
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              item.status === "OUT_OF_STOCK" || item.status === "CRITICAL"
                                ? "destructive"
                                : item.status === "LOW"
                                ? "warning"
                                : "outline"
                            }
                            className="rounded-full text-[10px] px-2.5 py-0.5"
                          >
                            {item.status.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                  All inventory items are well-stocked above low stock thresholds.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 3️⃣ Seller & Warranty Intelligence */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" /> Seller & Warranty Performance
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Sellers Table */}
          <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 border-b border-border">
              <h3 className="text-base font-bold text-foreground">Top Performing Sellers</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Offline merchants by gross revenue</p>
            </div>
            <div className="overflow-x-auto">
              {analytics?.topSellers && analytics.topSellers.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                    <tr>
                      <th className="p-4">Merchant Name</th>
                      <th className="p-4 text-right">Units Sold</th>
                      <th className="p-4 text-right">Gross Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {analytics.topSellers.map((seller, i) => (
                      <tr key={i} className="hover:bg-muted/40 transition-colors">
                        <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                          <Store className="h-4 w-4 text-muted-foreground" />
                          {seller.name}
                        </td>
                        <td className="p-4 text-right font-bold text-foreground">{seller.sales}</td>
                        <td className="p-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                          ৳{seller.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  <Store className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No offline seller transactions recorded yet for this period.
                </div>
              )}
            </div>
          </Card>

          {/* Warranties Expiring Soon */}
          <Card className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-foreground">Warranties Expiring Soon</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Active coverage ending within 30 days</p>
              </div>
              <Badge variant="outline" className="rounded-full text-[11px] px-2.5 py-0.5 border-border">
                Next 30 Days
              </Badge>
            </div>
            <div className="overflow-x-auto">
              {analytics?.expiringWarranties && analytics.expiringWarranties.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                    <tr>
                      <th className="p-4">Serial / Unique ID</th>
                      <th className="p-4">Product & Customer</th>
                      <th className="p-4 text-right">Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {analytics.expiringWarranties.map((w) => (
                      <tr key={w.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-primary">{w.uniqueId}</td>
                        <td className="p-4">
                          <div className="font-semibold text-foreground">{w.product}</div>
                          <div className="text-xs text-muted-foreground">{w.customer}</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                            {formatAppDate(w.expiryDate)}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            ({w.daysRemaining} {w.daysRemaining === 1 ? "day" : "days"} left)
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No active warranties expiring within the next 30 days.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
